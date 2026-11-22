import { randomUUID } from "node:crypto";
import { SingleFlight, TtlCache } from "./cache";
import { analyzeOffline } from "./engine";
import { detectLanguage, isSupportedLanguage } from "./language";
import { hashText, normalizeInput, redact, truncateInput } from "./pii";
import { citationsFor } from "./knowledge";
import type { AnalysisResult, AnalyzeRequest, Channel, Language } from "./types";
import type { StoredAnalysis } from "./store";

export class RequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "RequestError";
    this.code = code;
    this.status = status;
  }
}

const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL ?? 600);
const MIN_CONFIDENCE = Number(process.env.MIN_CONFIDENCE ?? 0.4);

const resultCache = new TtlCache<AnalysisResult>(CACHE_TTL_SECONDS, 200);
const singleFlight = new SingleFlight<AnalysisResult>();

export interface AnalyzeOutcome {
  result: AnalysisResult;
  stored: StoredAnalysis;
  truncated: boolean;
}

function parseChannel(value: unknown): Channel {
  if (value === undefined) return "sms";
  if (value === "sms" || value === "email" || value === "web" || value === "voice_transcript") {
    return value;
  }
  throw new RequestError("Unknown channel", "invalid_channel", 400);
}

function parseLanguage(value: unknown, text: string): Language {
  if (value !== undefined) {
    if (typeof value !== "string" || !isSupportedLanguage(value)) {
      throw new RequestError(
        "Language must be one of: id, en, es",
        "unsupported_language",
        400,
      );
    }
    return value;
  }
  return detectLanguage(text) ?? "id";
}

export async function analyzeMessage(body: unknown): Promise<AnalyzeOutcome> {
  if (typeof body !== "object" || body === null) {
    throw new RequestError("Request body must be JSON", "invalid_body", 400);
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.text !== "string") {
    throw new RequestError("Field 'text' is required", "missing_text", 400);
  }

  const normalized = normalizeInput(payload.text);
  if (normalized.length === 0) {
    throw new RequestError("Message is empty", "empty_input", 400);
  }

  const { text, truncated } = truncateInput(normalized, 4000);
  const channel = parseChannel(payload.channel);
  const language = parseLanguage(payload.language, text);
  const consent = payload.consentToStore !== false;

  const textHash = hashText(text);
  const cacheKey = `${textHash}:${channel}:${language}`;
  const startedAt = Date.now();

  const cached = resultCache.get(cacheKey);
  if (cached) {
    return {
      result: {
        ...cached,
        latency_ms: Date.now() - startedAt,
        model_used: `${cached.model_used}+cache`,
      },
      stored: buildStoredRow(cached, {
        textHash,
        excerpt: "",
        consent,
        id: randomUUID(),
        channel,
        language,
      }),
      truncated,
    };
  }

  const result = await singleFlight.run(cacheKey, async () => {
    const redaction = redact(text);
    const scored = analyzeOffline({ text, channel, language });
    const confidenceFloor = Math.min(MIN_CONFIDENCE, 0.4);

    const adjusted: AnalysisResult = {
      ...scored,
      risk_score: Math.max(0, Math.min(100, scored.risk_score)),
      citations:
        scored.refuse || scored.label === "insufficient_info"
          ? []
          : scored.citations.length > 0
            ? scored.citations
            : citationsFor(scored.category, language),
      safety_meta: {
        ...scored.safety_meta,
        pii_redacted: redaction.redacted,
      },
    };

    if (adjusted.confidence < confidenceFloor && !adjusted.refuse) {
      adjusted.label = "insufficient_info";
    }
    if (truncated) {
      adjusted.safety_meta.limited_analysis = true;
    }

    resultCache.set(cacheKey, adjusted);
    return adjusted;
  });

  const redaction = redact(text);
  const stored = buildStoredRow(result, {
    textHash,
    excerpt: consent ? redaction.text : "",
    consent,
    id: randomUUID(),
    channel,
    language,
  });

  console.info(
    JSON.stringify({
      event: "analysis_completed",
      request_id: stored.id,
      model: result.model_used,
      prompt_version: "assess-v1.0",
      latency_ms: Date.now() - startedAt,
      risk_score: result.risk_score,
      label: result.label,
      refuse: result.refuse,
      language,
      channel,
      truncated,
    }),
  );

  return {
    result: { ...result, latency_ms: Date.now() - startedAt },
    stored,
    truncated,
  };
}

function buildStoredRow(
  result: AnalysisResult,
  meta: {
    textHash: string;
    excerpt: string;
    consent: boolean;
    id: string;
    channel: StoredAnalysis["channel"];
    language: StoredAnalysis["language"];
  },
): StoredAnalysis {
  return {
    id: meta.id,
    created_at: new Date().toISOString(),
    text_hash: meta.textHash,
    excerpt: meta.consent ? meta.excerpt : "",
    channel: meta.channel,
    language: meta.language,
    risk_score: result.risk_score,
    label: result.label,
    category: result.category,
    refuse: result.refuse,
    degraded: result.safety_meta.degraded,
    confidence: result.confidence,
    latency_ms: result.latency_ms,
    model_used: result.model_used,
  };
}
