import { randomUUID } from "node:crypto";
import { jsonError, readJson } from "@/lib/http";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { recordPrePostBestEffort } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hackathon evaluation hook for the 20-respondent pre/post instrument.
 * Not part of the public product UI: the evaluation form posts here so the
 * dashboard learning panel reads real numbers instead of fabricated ones.
 */
export async function POST(request: Request): Promise<Response> {
  const perMinute = Number(process.env.PREPOST_RATE_LIMIT ?? 60);
  const limit = checkRateLimit(
    `prepost:${clientKey(request.headers, "unknown")}`,
    Number.isFinite(perMinute) && perMinute > 0 ? perMinute : 60,
  );
  if (!limit.allowed) {
    return jsonError(429, "rate_limited", "Too many submissions.", {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  try {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) {
      return jsonError(400, "invalid_body", "Request body must be JSON.");
    }
    const payload = body as Record<string, unknown>;
    if (payload.phase !== "pre" && payload.phase !== "post") {
      return jsonError(400, "invalid_phase", "phase must be 'pre' or 'post'.");
    }
    if (
      typeof payload.scorePct !== "number" ||
      payload.scorePct < 0 ||
      payload.scorePct > 100
    ) {
      return jsonError(400, "invalid_score", "scorePct must be a number between 0 and 100.");
    }

    await recordPrePostBestEffort({
      id: randomUUID(),
      created_at: new Date().toISOString(),
      phase: payload.phase,
      score_pct: Math.round(payload.scorePct),
    });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonError(400, "invalid_json", "Request body must be valid JSON.");
    }
    return jsonError(500, "internal_error", "Could not record the result.");
  }
}
