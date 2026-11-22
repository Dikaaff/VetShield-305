import { mkdir, appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { isSnowflakeConfigured, runSql } from "./snowflake";
import type {
  Channel,
  DashboardSummary,
  Language,
  RiskLabel,
  ScamCategory,
} from "./types";

export interface StoredAnalysis {
  id: string;
  created_at: string;
  text_hash: string;
  excerpt: string;
  channel: Channel;
  language: Language;
  risk_score: number;
  label: RiskLabel;
  category: ScamCategory;
  refuse: boolean;
  degraded: boolean;
  confidence: number;
  latency_ms: number;
  model_used: string;
}

export interface StoredPractice {
  id: string;
  created_at: string;
  session_id: string;
  scenario_id: string;
  category: ScamCategory;
  difficulty: "easy" | "medium" | "hard";
  verdict: "correct" | "partially_correct" | "incorrect";
  correct: boolean;
}

export interface StoredPrePost {
  id: string;
  created_at: string;
  phase: "pre" | "post";
  score_pct: number;
}

export interface Store {
  readonly source: "snowflake" | "local" | "memory";
  recordAnalysis(row: StoredAnalysis): Promise<void>;
  recordPractice(row: StoredPractice): Promise<void>;
  recordPrePost(row: StoredPrePost): Promise<void>;
  summary(windowDays: number): Promise<DashboardSummary>;
}

const DAY_MS = 86_400_000;

function memoryDate(days: number): number {
  return Date.now() - days * DAY_MS;
}

const memory = {
  analyses: [] as StoredAnalysis[],
  practice: [] as StoredPractice[],
  prepost: [] as StoredPrePost[],
  fsAvailable: true,
};

async function dataDir(): Promise<string> {
  const dir = join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  return dir;
}

async function appendJsonl(file: string, row: unknown): Promise<void> {
  if (!memory.fsAvailable) return;
  try {
    const dir = await dataDir();
    await appendFile(join(dir, file), `${JSON.stringify(row)}\n`, "utf8");
  } catch {
    // Serverless filesystems are read-only. Keep the in-memory copy so the
    // dashboard still has honest data for the running instance.
    memory.fsAvailable = false;
  }
}

async function readJsonl<T>(file: string): Promise<T[]> {
  if (!memory.fsAvailable) return [];
  try {
    const dir = await dataDir();
    const raw = await readFile(join(dir, file), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as T];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round(((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2)
    : (sorted[middle] ?? null);
}

const ALL_LABELS: RiskLabel[] = [
  "scam_likely",
  "suspicious",
  "likely_legitimate",
  "insufficient_info",
];

const BUCKETS = ["0-19", "20-39", "40-59", "60-79", "80-100"];

function bucketFor(score: number): string {
  if (score >= 80) return "80-100";
  if (score >= 60) return "60-79";
  if (score >= 40) return "40-59";
  if (score >= 20) return "20-39";
  return "0-19";
}

export function aggregate(input: {
  source: "snowflake" | "local" | "memory";
  analyses: StoredAnalysis[];
  practice: StoredPractice[];
  prepost: StoredPrePost[];
  windowDays: number;
}): DashboardSummary {
  const cutoff = memoryDate(input.windowDays);
  const analyses = input.analyses.filter(
    (row) => new Date(row.created_at).getTime() >= cutoff,
  );
  const practice = input.practice.filter(
    (row) => new Date(row.created_at).getTime() >= cutoff,
  );
  const prepost = input.prepost.filter(
    (row) => new Date(row.created_at).getTime() >= cutoff,
  );

  const labelCounts = new Map<RiskLabel, number>(ALL_LABELS.map((label) => [label, 0]));
  const categoryCounts = new Map<ScamCategory, number>();
  const hist = new Map(BUCKETS.map((bucket) => [bucket, { count: 0, refused: 0 }]));
  const practiceByCategory = new Map<ScamCategory, { attempts: number; correct: number }>();

  for (const row of analyses) {
    labelCounts.set(row.label, (labelCounts.get(row.label) ?? 0) + 1);
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
    const entry = hist.get(bucketFor(row.risk_score));
    if (entry) {
      entry.count += 1;
      if (row.refuse) entry.refused += 1;
    }
  }

  for (const row of practice) {
    const entry = practiceByCategory.get(row.category) ?? { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (row.correct) entry.correct += 1;
    practiceByCategory.set(row.category, entry);
  }

  const preScores = prepost.filter((row) => row.phase === "pre").map((row) => row.score_pct);
  const postScores = prepost.filter((row) => row.phase === "post").map((row) => row.score_pct);
  const pairedN = Math.min(preScores.length, postScores.length);
  const avg = (values: number[]) =>
    values.length === 0 ? 0 : Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const learning = {
    pre: avg(preScores),
    post: avg(postScores),
    n: pairedN,
    deltaPct: pairedN > 0 ? avg(postScores) - avg(preScores) : null,
  };

  const refused = analyses.filter((row) => row.refuse).length;
  const degraded = analyses.filter((row) => row.degraded).length;
  const rate = (count: number) =>
    analyses.length === 0 ? null : Math.round((count / analyses.length) * 1000) / 10;

  return {
    window: input.windowDays <= 7 ? "7d" : input.windowDays <= 30 ? "30d" : "all",
    source: input.source,
    totals: {
      analyses: analyses.length,
      practiceAnswers: practice.length,
    },
    labels: ALL_LABELS.map((label) => ({ label, count: labelCounts.get(label) ?? 0 })),
    categories: [...categoryCounts.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    riskHistogram: BUCKETS.map((bucket) => ({
      bucket,
      count: hist.get(bucket)?.count ?? 0,
      refused: hist.get(bucket)?.refused ?? 0,
    })),
    practice: [...practiceByCategory.entries()]
      .map(([category, entry]) => ({ category, ...entry }))
      .sort((a, b) => b.attempts - a.attempts),
    learning,
    reliability: {
      refusalRate: rate(refused),
      degradedRate: rate(degraded),
      medianLatencyMs: median(analyses.map((row) => row.latency_ms)),
      n: analyses.length,
    },
    generatedAt: new Date().toISOString(),
  };
}

class LocalStore implements Store {
  readonly source = "local" as const;

  async recordAnalysis(row: StoredAnalysis): Promise<void> {
    memory.analyses.push(row);
    await appendJsonl("analyses.jsonl", row);
  }

  async recordPractice(row: StoredPractice): Promise<void> {
    memory.practice.push(row);
    await appendJsonl("practice.jsonl", row);
  }

  async recordPrePost(row: StoredPrePost): Promise<void> {
    memory.prepost.push(row);
    await appendJsonl("prepost.jsonl", row);
  }

  async summary(windowDays: number): Promise<DashboardSummary> {
    const [analyses, practice, prepost] = await Promise.all([
      readJsonl<StoredAnalysis>("analyses.jsonl"),
      readJsonl<StoredPractice>("practice.jsonl"),
      readJsonl<StoredPrePost>("prepost.jsonl"),
    ]);

    return aggregate({
      source: memory.fsAvailable ? "local" : "memory",
      analyses: [...analyses, ...memory.analyses],
      practice: [...practice, ...memory.practice],
      prepost: [...prepost, ...memory.prepost],
      windowDays,
    });
  }
}

class SnowflakeStore implements Store {
  readonly source = "snowflake" as const;

  async recordAnalysis(row: StoredAnalysis): Promise<void> {
    await runSql(
      `MERGE INTO ANALYSES t
       USING (SELECT ? AS analysis_id, ? AS text_hash, ? AS excerpt, ? AS channel,
                     ? AS language, ? AS risk_score, ? AS label, ? AS category,
                     ? AS refuse, ? AS degraded, ? AS confidence, ? AS latency_ms,
                     ? AS model_used) s
       ON t.ANALYSIS_ID = s.analysis_id
       WHEN NOT MATCHED THEN INSERT
         (ANALYSIS_ID, TEXT_HASH, EXCERPT_REDACTED, CHANNEL, LANGUAGE, RISK_SCORE,
          RISK_LABEL, CATEGORY, REFUSE, DEGRADED, CONFIDENCE, LATENCY_MS, MODEL_USED, CREATED_AT)
       VALUES (s.analysis_id, s.text_hash, s.excerpt, s.channel, s.language, s.risk_score,
               s.label, s.category, s.refuse, s.degraded, s.confidence, s.latency_ms,
               s.model_used, CURRENT_TIMESTAMP())`,
      {
        bindings: [
          row.id,
          row.text_hash,
          row.excerpt,
          row.channel,
          row.language,
          row.risk_score,
          row.label,
          row.category,
          row.refuse,
          row.degraded,
          row.confidence,
          row.latency_ms,
          row.model_used,
        ],
        timeoutMs: 6000,
      },
    );
  }

  async recordPractice(row: StoredPractice): Promise<void> {
    await runSql(
      `MERGE INTO LEARNER_RESPONSES t
       USING (SELECT ? AS response_id, ? AS session_id, ? AS scenario_id,
                     ? AS category, ? AS difficulty, ? AS verdict, ? AS is_correct) s
       ON t.RESPONSE_ID = s.response_id
       WHEN NOT MATCHED THEN INSERT
         (RESPONSE_ID, SESSION_ID, SCENARIO_ID, CATEGORY, DIFFICULTY, VERDICT, IS_CORRECT, CREATED_AT)
       VALUES (s.response_id, s.session_id, s.scenario_id, s.category, s.difficulty,
               s.verdict, s.is_correct, CURRENT_TIMESTAMP())`,
      {
        bindings: [
          row.id,
          row.session_id,
          row.scenario_id,
          row.category,
          row.difficulty,
          row.verdict,
          row.correct,
        ],
        timeoutMs: 6000,
      },
    );
  }

  async recordPrePost(row: StoredPrePost): Promise<void> {
    await runSql(
      `MERGE INTO PREPOST_TESTS t
       USING (SELECT ? AS test_id, ? AS phase, ? AS score_pct) s
       ON t.TEST_ID = s.test_id
       WHEN NOT MATCHED THEN INSERT (TEST_ID, PHASE, SCORE_PCT, CREATED_AT)
       VALUES (s.test_id, s.phase, s.score_pct, CURRENT_TIMESTAMP())`,
      { bindings: [row.id, row.phase, row.score_pct], timeoutMs: 6000 },
    );
  }

  async summary(windowDays: number): Promise<DashboardSummary> {
    const [analyses, practice, prepost] = await Promise.all([
      runSql<StoredAnalysis>(
        `SELECT ANALYSIS_ID AS ID, CREATED_AT, TEXT_HASH, EXCERPT_REDACTED AS EXCERPT,
                CHANNEL, LANGUAGE, RISK_SCORE, RISK_LABEL AS LABEL, CATEGORY,
                REFUSE, DEGRADED, CONFIDENCE, LATENCY_MS, MODEL_USED
         FROM ANALYSES
         WHERE CREATED_AT >= DATEADD(day, ?, CURRENT_TIMESTAMP())
         ORDER BY CREATED_AT DESC LIMIT 5000`,
        { bindings: [-windowDays], timeoutMs: 8000 },
      ),
      runSql<StoredPractice>(
        `SELECT RESPONSE_ID AS ID, CREATED_AT, SESSION_ID, SCENARIO_ID, CATEGORY,
                DIFFICULTY, VERDICT, IS_CORRECT AS CORRECT
         FROM LEARNER_RESPONSES
         WHERE CREATED_AT >= DATEADD(day, ?, CURRENT_TIMESTAMP())
         LIMIT 5000`,
        { bindings: [-windowDays], timeoutMs: 8000 },
      ),
      runSql<StoredPrePost>(
        `SELECT TEST_ID AS ID, CREATED_AT, PHASE, SCORE_PCT
         FROM PREPOST_TESTS
         WHERE CREATED_AT >= DATEADD(day, ?, CURRENT_TIMESTAMP())
         LIMIT 500`,
        { bindings: [-windowDays], timeoutMs: 8000 },
      ),
    ]);

    return aggregate({ source: "snowflake", analyses, practice, prepost, windowDays });
  }
}

const localStore = new LocalStore();
const snowflakeStore = new SnowflakeStore();

export function getStore(): Store {
  return isSnowflakeConfigured() ? snowflakeStore : localStore;
}

/** Writes are always best-effort: a storage failure must never fail a check. */
export async function recordAnalysisBestEffort(row: StoredAnalysis): Promise<void> {
  try {
    await getStore().recordAnalysis(row);
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "store_write_failed",
        table: "ANALYSES",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    try {
      await localStore.recordAnalysis(row);
    } catch {
      // in-memory copy inside LocalStore is already enough for the session
    }
  }
}

export async function recordPracticeBestEffort(row: StoredPractice): Promise<void> {
  try {
    await getStore().recordPractice(row);
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "store_write_failed",
        table: "LEARNER_RESPONSES",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    await localStore.recordPractice(row).catch(() => undefined);
  }
}

export async function recordPrePostBestEffort(row: StoredPrePost): Promise<void> {
  try {
    await getStore().recordPrePost(row);
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "store_write_failed",
        table: "PREPOST_TESTS",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    await localStore.recordPrePost(row).catch(() => undefined);
  }
}

export const localSummary = (windowDays: number) => localStore.summary(windowDays);
