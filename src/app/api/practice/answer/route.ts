import { jsonError, readJson } from "@/lib/http";
import { answerQuestion } from "@/lib/practice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    if (typeof payload.scenarioId !== "string") {
      return jsonError(400, "missing_scenario", "A scenarioId is required.");
    }
    if (payload.choice !== "scam" && payload.choice !== "legit") {
      return jsonError(400, "invalid_choice", "choice must be 'scam' or 'legit'.");
    }
    if (payload.reasoning !== undefined && typeof payload.reasoning !== "string") {
      return jsonError(400, "invalid_reasoning", "reasoning must be text.");
    }

    const feedback = await answerQuestion({
      sessionId: payload.sessionId,
      scenarioId: payload.scenarioId,
      choice: payload.choice,
      reasoning: typeof payload.reasoning === "string" ? payload.reasoning.slice(0, 400) : "",
    });
    return Response.json(feedback, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonError(400, "invalid_json", "Request body must be valid JSON.");
    }
    if (error instanceof Error && /Unknown scenario/.test(error.message)) {
      return jsonError(404, "scenario_not_found", "That scenario does not exist.");
    }
    console.error(
      JSON.stringify({
        event: "practice_answer_failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError(503, "practice_unavailable", "Practice is unavailable right now.");
  }
}
