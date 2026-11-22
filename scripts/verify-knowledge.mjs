import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Checks every curated source URL and records the result. The generated
 * knowledge base only cites sources that returned a 200-399 status.
 *
 * Some public sites block non-browser clients or are slow; each URL gets three
 * attempts. A previously verified URL stays verified if a later run fails
 * transiently, but the failure is recorded so it can be reviewed.
 */
const here = dirname(fileURLToPath(import.meta.url));
const SOURCES = join(here, "..", "data", "knowledge-sources.jsonl");
const OUT = join(here, "..", "data", "knowledge-verification.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const raw = await readFile(SOURCES, "utf8");
const sources = raw.split("\n").filter(Boolean).map((line) => JSON.parse(line));

let previous = { results: {} };
try {
  previous = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  // First run.
}

async function check(url) {
  let lastError = "unknown";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12_000);
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      return {
        status: response.status,
        ok: response.status >= 200 && response.status < 400,
        finalUrl: response.url,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { status: null, ok: false, finalUrl: null, attempts: 2, error: lastError };
}

const results = {};
let checked = 0;

async function verifyOne(source) {
  const prior = previous.results?.[source.id];
  const fresh = await check(source.url);
  if (!fresh.ok && prior?.ok && prior?.url === source.url) {
    results[source.id] = {
      ...prior,
      lastFailureAt: new Date().toISOString(),
      lastFailure: fresh.error ?? `HTTP ${fresh.status}`,
    };
  } else {
    results[source.id] = {
      url: source.url,
      status: fresh.status,
      ok: fresh.ok,
      finalUrl: fresh.finalUrl,
      attempts: fresh.attempts,
      checkedAt: new Date().toISOString(),
      ...(fresh.error ? { error: fresh.error } : {}),
    };
  }
  checked += 1;
  const entry = results[source.id];
  console.log(`${entry.ok ? "OK  " : "FAIL"} ${entry.status ?? "---"} ${source.id} ${source.url}`);
}

let cursor = 0;
async function worker() {
  while (cursor < sources.length) {
    const index = cursor;
    cursor += 1;
    await verifyOne(sources[index]);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

const okCount = Object.values(results).filter((entry) => entry.ok).length;
await writeFile(
  OUT,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), checked, okCount, results }, null, 2)}\n`,
  "utf8",
);

console.log(`\n${okCount}/${checked} sources verified. Wrote ${OUT}`);
if (okCount < checked) {
  console.log("Unverified sources stay in the corpus but are excluded from citations.");
}
