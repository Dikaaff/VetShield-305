import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Evaluates the running analyzer on the held-out 30% of the synthetic corpus.
 * The split is by hashed scenario id, so it is stable across runs and no item
 * used for tuning is scored here.
 *
 * Usage: ANALYZE_RATE_LIMIT=1000 npx next start -p 3111  (in another shell)
 *        API_BASE=http://localhost:3111 npm run eval
 */
const here = dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE ?? "http://localhost:3111";

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const isTest = (id) => fnv1a(id) % 10 < 3;

const raw = await readFile(join(here, "..", "data", "scenarios.jsonl"), "utf8");
const all = raw.split("\n").filter(Boolean).map((line) => JSON.parse(line));
const test = all.filter((scenario) => isTest(scenario.id));

const KEYWORD = /otp|transfer|klik|link|bayar|verify|code|urgent|segera|blokir|menang|prize|rekening|kode/i;

async function analyze(scenario) {
  const started = performance.now();
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: scenario.text,
      channel: scenario.channel,
      language: scenario.language,
      consentToStore: false,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${scenario.id}`);
  const result = await response.json();
  return { scenario, result, wallMs: Math.round(performance.now() - started) };
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      out[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: size }, run));
  return out;
}

const rows = await pool(test, 4, analyze);

const positive = (label) => label === "scam_likely" || label === "suspicious";
const predictedScam = (label) => label === "scam_likely" || label === "suspicious";

let tp = 0;
let fp = 0;
let fn = 0;
let tn = 0;
let refused = 0;
let degraded = 0;
let baselineTp = 0;
let baselineFp = 0;
let baselineFn = 0;
let baselineTn = 0;
const perDifficulty = {};
const perLanguage = {};
const confusion = {};
const latencies = [];

for (const { scenario, result, wallMs } of rows) {
  const isScam = scenario.label === "scam";
  const pred = predictedScam(result.label);
  if (isScam && pred) tp += 1;
  if (!isScam && pred) fp += 1;
  if (isScam && !pred) fn += 1;
  if (!isScam && !pred) tn += 1;
  if (result.refuse) refused += 1;
  if (result.safety_meta?.degraded) degraded += 1;
  latencies.push(result.latency_ms ?? wallMs);

  const basePred = KEYWORD.test(scenario.text);
  if (isScam && basePred) baselineTp += 1;
  if (!isScam && basePred) baselineFp += 1;
  if (isScam && !basePred) baselineFn += 1;
  if (!isScam && !basePred) baselineTn += 1;

  for (const [bucket, key] of [
    [perDifficulty, scenario.difficulty],
    [perLanguage, scenario.language],
  ]) {
    bucket[key] ??= { n: 0, correct: 0 };
    bucket[key].n += 1;
    if (pred === isScam) bucket[key].correct += 1;
  }
  confusion[result.label] ??= { scam: 0, legit: 0 };
  confusion[result.label][scenario.label] += 1;
}

const accuracy = (tp + tn) / rows.length;
const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
const falseAlarmRate = fp + tn === 0 ? null : fp / (fp + tn);
const missRate = tp + fn === 0 ? null : fn / (tp + fn);
const baseAccuracy = (baselineTp + baselineTn) / rows.length;
const sorted = [...latencies].sort((a, b) => a - b);
const percentile = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;

const summary = {
  generatedAt: new Date().toISOString(),
  apiBase: API_BASE,
  split: { rule: "fnv1a(id) % 10 < 3", testItems: test.length, trainItems: all.length - test.length },
  dataset: { total: all.length, synthetic: true },
  metrics: {
    accuracy,
    precisionScam: precision,
    recallScam: recall,
    f1Scam: f1,
    falseAlarmRate,
    missRate,
    refused,
    refusalRate: refused / rows.length,
    degradedRate: degraded / rows.length,
    latencyP50: percentile(0.5),
    latencyP95: percentile(0.95),
  },
  keywordBaseline: {
    accuracy: baseAccuracy,
    precisionScam: baselineTp + baselineFp === 0 ? 0 : baselineTp / (baselineTp + baselineFp),
    recallScam: baselineTp + baselineFn === 0 ? 0 : baselineTp / (baselineTp + baselineFn),
  },
  confusion,
  perDifficulty,
  perLanguage,
  rows: rows.map(({ scenario, result }) => ({
    id: scenario.id,
    gold: scenario.label,
    predicted: result.label,
    score: result.risk_score,
    difficulty: scenario.difficulty,
    language: scenario.language,
    adversarial: scenario.adversarial ?? null,
  })),
};

await writeFile(
  join(here, "..", "data", "eval-results.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

const fmt = (value) => (value === null ? "n/a" : `${(value * 100).toFixed(1)}%`);
console.log(`Test items: ${test.length} (synthetic, held out by id hash)`);
console.table({
  "Engine accuracy": fmt(accuracy),
  "Scam precision": fmt(precision),
  "Scam recall": fmt(recall),
  "Scam F1": fmt(f1),
  "False alarm rate": fmt(falseAlarmRate),
  "Missed scam rate": fmt(missRate),
  "Refusal rate": fmt(refused / rows.length),
  "Keyword baseline acc.": fmt(baseAccuracy),
  "Latency p50": `${percentile(0.5)} ms`,
  "Latency p95": `${percentile(0.95)} ms`,
});
console.table(perDifficulty);
console.table(perLanguage);
console.log("Label confusion:", confusion);
