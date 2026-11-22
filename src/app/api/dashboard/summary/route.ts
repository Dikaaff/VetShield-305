import { jsonError } from "@/lib/http";
import { getStore, localSummary } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const windowParam = url.searchParams.get("window") ?? "7d";
  const windowDays = windowParam === "30d" ? 30 : windowParam === "all" ? 3650 : 7;

  try {
    const summary = await getStore().summary(windowDays);
    return Response.json(summary, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.warn(
      JSON.stringify({
        event: "dashboard_degraded",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    try {
      const fallback = await localSummary(windowDays);
      return Response.json(fallback, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return jsonError(503, "dashboard_unavailable", "Analytics are unavailable.");
    }
  }
}
