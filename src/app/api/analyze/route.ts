import { after } from "next/server";
import { analyzeMessage, RequestError } from "@/lib/analyze";
import { jsonError, readJson } from "@/lib/http";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { recordAnalysisBestEffort } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IdempotentEntry {
  body: unknown;
  expiresAt: number;
}

const idempotentResponses = new Map<string, IdempotentEntry>();
const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

function pruneIdempotency(): void {
  const now = Date.now();
  for (const [key, entry] of idempotentResponses) {
    if (entry.expiresAt <= now) idempotentResponses.delete(key);
  }
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientKey(request.headers, "unknown");
  const perMinute = Number(process.env.ANALYZE_RATE_LIMIT ?? 30);
  const limit = checkRateLimit(
    `analyze:${ip}`,
    Number.isFinite(perMinute) && perMinute > 0 ? perMinute : 30,
  );
  if (!limit.allowed) {
    return jsonError(429, "rate_limited", "Too many analyses. Try again in a minute.", {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey) {
    pruneIdempotency();
    const previous = idempotentResponses.get(idempotencyKey);
    if (previous) return Response.json(previous.body);
  }

  try {
    const body = await readJson(request);
    const outcome = await analyzeMessage(body);

    after(() => recordAnalysisBestEffort(outcome.stored));

    if (idempotencyKey) {
      idempotentResponses.set(idempotencyKey, {
        body: outcome.result,
        expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
      });
    }

    return Response.json(outcome.result, {
      headers: {
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonError(400, "invalid_json", "Request body must be valid JSON.");
    }
    if (error instanceof RequestError) {
      return jsonError(error.status, error.code, error.message);
    }
    console.error(
      JSON.stringify({
        event: "analysis_failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError(500, "internal_error", "The checker is temporarily unavailable.");
  }
}
