export type Channel = "sms" | "email" | "web" | "voice_transcript";
export type Language = "id" | "en" | "es";
export type RiskLabel =
  | "scam_likely"
  | "suspicious"
  | "likely_legitimate"
  | "insufficient_info";

export type ScamCategory =
  | "bank"
  | "benefits"
  | "job"
  | "delivery"
  | "marketplace"
  | "romance"
  | "tech_support"
  | "investment"
  | "tax"
  | "family_emergency"
  | "account_security"
  | "prize"
  | "other";

export interface Citation {
  doc_id: string;
  title: string;
  claim: string;
  url?: string;
}

export interface SafetyMeta {
  injection_detected: boolean;
  pii_redacted: boolean;
  degraded: boolean;
  limited_analysis: boolean;
}

export interface AnalysisResult {
  risk_score: number;
  label: RiskLabel;
  category: ScamCategory;
  red_flags: string[];
  plain_explanation: string;
  safe_actions: [string, string, string];
  confidence: number;
  refuse: boolean;
  citations: Citation[];
  model_used: string;
  latency_ms: number;
  safety_meta: SafetyMeta;
}

export interface AnalyzeRequest {
  text: string;
  channel?: Channel;
  language?: Language;
  consentToStore?: boolean;
}

export interface Scenario {
  id: string;
  text: string;
  channel: Channel;
  language: Language;
  label: "scam" | "legit";
  category: ScamCategory;
  difficulty: "easy" | "medium" | "hard";
  red_flags: string[];
  evidence_rule: string;
  pii_safe: true;
  expected_score_band?: string;
}

export type PracticeVerdict = "correct" | "partially_correct" | "incorrect";

export interface PracticeQuestion {
  scenarioId: string;
  text: string;
  channel: Channel;
  language: Language;
  category: ScamCategory;
  difficulty: "easy" | "medium" | "hard";
  attempt: number;
}

export interface PracticeFeedback {
  scenarioId: string;
  verdict: PracticeVerdict;
  correctLabel: "scam" | "legit";
  why: string;
  misconception: string | null;
  nextDifficulty: "easy" | "medium" | "hard";
  nextCategory: ScamCategory;
  tip: string;
  redFlags: string[];
}

export interface DashboardSummary {
  window: "7d" | "30d" | "all";
  source: "snowflake" | "local" | "memory";
  totals: { analyses: number; practiceAnswers: number };
  labels: { label: RiskLabel; count: number }[];
  categories: { category: ScamCategory; count: number }[];
  riskHistogram: { bucket: string; count: number; refused: number }[];
  practice: { category: ScamCategory; attempts: number; correct: number }[];
  learning: { pre: number; post: number; n: number; deltaPct: number | null };
  reliability: {
    refusalRate: number | null;
    degradedRate: number | null;
    medianLatencyMs: number | null;
    n: number;
  };
  generatedAt: string;
}
