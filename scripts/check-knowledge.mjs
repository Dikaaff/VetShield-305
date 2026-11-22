import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Deterministic knowledge-base integrity check for CI. No network access:
 * the live URL check lives in scripts/verify-knowledge.mjs and runs weekly.
 */
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const sources = (await readFile(join(root, "data", "knowledge-sources.jsonl"), "utf8"))
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const verification = JSON.parse(
  await readFile(join(root, "data", "knowledge-verification.json"), "utf8"),
);
const generated = await readFile(join(root, "src", "lib", "knowledge-base.ts"), "utf8");

const errors = [];
const languages = ["id", "en", "es"];

if (sources.length < 40) errors.push(`Expected at least 40 sources, found ${sources.length}`);
if (new Set(sources.map((source) => source.url)).size !== sources.length) {
  errors.push("Duplicate source URLs found");
}

for (const source of sources) {
  for (const lang of languages) {
    if (!source.claims?.[lang] || source.claims[lang].trim().length < 20) {
      errors.push(`${source.id}: claim ${lang} missing or too short`);
    }
  }
  if (!Array.isArray(source.categories) || source.categories.length === 0) {
    errors.push(`${source.id}: no categories`);
  }
  const check = verification.results?.[source.id];
  if (!check?.ok) errors.push(`${source.id}: source is not verified`);
  if (!generated.includes(`"id": "${source.id}-ID"`)) {
    errors.push(`${source.id}: generated document missing`);
  }
}

const docCount = (generated.match(/"verified": true/g) ?? []).length;
if (docCount !== sources.length * languages.length) {
  errors.push(`Expected ${sources.length * languages.length} verified docs, found ${docCount}`);
}

const checkedAt = verification.generatedAt ? new Date(verification.generatedAt) : null;
if (checkedAt && Date.now() - checkedAt.getTime() > 365 * 86_400_000) {
  errors.push("Knowledge verification is older than 365 days");
}

if (errors.length > 0) {
  console.error(`Knowledge check failed (${errors.length}):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(
  `Knowledge check passed: ${sources.length} sources, ${docCount} documents, ` +
    `verified ${checkedAt?.toISOString().slice(0, 10) ?? "unknown"}.`,
);
