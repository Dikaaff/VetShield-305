import { snowflakeStatus } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json({
    ok: true,
    service: "vetshield-305",
    version: "0.1.0",
    engine: "vetshield-rules-v1",
    explanations: process.env.GEMMA_MODEL ?? "local-templates",
    snowflake: snowflakeStatus(),
    time: new Date().toISOString(),
  });
}
