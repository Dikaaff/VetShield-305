import { jsonError, readJson } from "@/lib/http";
import { nextQuestion } from "@/lib/practice";
import type { ScamCategory } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES: ScamCategory[] = [
  "bank",
  "benefits",
  "job",
  "delivery",
  "marketplace",
  "romance",
  "tech_support",
  "investment",
  "tax",
  "family_emergency",
  "account_security",
  "prize",
  "other",
];

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJson(request);
    if (typeof body !== "object" || body === null) {
      return jsonError(400, "invalid_body", "Request body must be JSON.");
    }
    const payload = body as Record<string, unknown>;
    if (typeof payload.sessionId !== "string" || payload.sessionId.length < 8) {
      return jsonError(400, "invalid_session", "A sessionId is required.");
    }
    const category =
      typeof payload.category === "string" &&
      CATEGORIES.includes(payload.category as ScamCategory)
        ? (payload.category as ScamCategory)
        : undefined;
    const difficulty =
      payload.difficulty === "easy" ||
      payload.difficulty === "medium" ||
      payload.difficulty === "hard"
        ? payload.difficulty
        : undefined;

    const question = await nextQuestion({
      sessionId: payload.sessionId,
      category,
      difficulty,
    });
    return Response.json(question, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonError(400, "invalid_json", "Request body must be valid JSON.");
    }
    console.error(
      JSON.stringify({
        event: "practice_next_failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError(503, "practice_unavailable", "Practice questions are unavailable.");
  }
}
