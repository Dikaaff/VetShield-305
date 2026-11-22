/**
 * Minimal Snowflake SQL API client (REST, server-side only).
 * Docs: POST /api/v2/statements then poll the statement handle.
 *
 * The app never requires this module to render: every caller degrades to the
 * local path when env vars are missing, the warehouse is suspended, or credits
 * are exhausted.
 */

export class SnowflakeError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 0) {
    super(message);
    this.name = "SnowflakeError";
    this.code = code;
    this.status = status;
  }
}

type BindingValue = string | number | boolean | null;

interface SqlApiResponse {
  statementHandle?: string;
  message?: string;
  code?: string;
  resultSetMetaData?: { rowType: { name: string }[] };
  data?: unknown[][];
  statementStatusUrl?: string;
  sqlState?: string;
}

const env = {
  account: process.env.SNOWFLAKE_ACCOUNT,
  user: process.env.SNOWFLAKE_USER,
  token: process.env.SNOWFLAKE_TOKEN,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE ?? "VETSHIELD_DB",
  schema: process.env.SNOWFLAKE_SCHEMA ?? "APP",
  role: process.env.SNOWFLAKE_ROLE,
};

export function isSnowflakeConfigured(): boolean {
  return Boolean(env.account && env.user && env.token);
}

export function snowflakeStatus(): {
  configured: boolean;
  database: string;
  schema: string;
} {
  return {
    configured: isSnowflakeConfigured(),
    database: env.database,
    schema: env.schema,
  };
}

function baseUrl(): string {
  if (!env.account) throw new SnowflakeError("Snowflake account missing", "not_configured");
  return `https://${env.account}.snowflakecomputing.com`;
}

function authHeaders(): Record<string, string> {
  if (!env.token) throw new SnowflakeError("Snowflake token missing", "not_configured");
  return {
    Authorization: `Bearer ${env.token}`,
    "X-Snowflake-Authorization-Token-Type": "PROGRAMMATIC_ACCESS_TOKEN",
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "vetshield-305/1.0",
  };
}

async function requestWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new SnowflakeError(`Snowflake timed out after ${timeoutMs}ms`, "timeout", 0);
    }
    throw new SnowflakeError(
      error instanceof Error ? error.message : "Snowflake network error",
      "network_error",
    );
  } finally {
    clearTimeout(timer);
  }
}

function toRows<T>(body: SqlApiResponse): T[] {
  const columns = body.resultSetMetaData?.rowType?.map((column) => column.name) ?? [];
  const rows = body.data ?? [];
  return rows.map((row) => {
    const record: Record<string, unknown> = {};
    columns.forEach((name, index) => {
      record[name] = row[index];
    });
    return record as T;
  });
}

export interface RunSqlOptions {
  timeoutMs?: number;
  bindings?: BindingValue[];
  retries?: number;
}

export async function runSql<T>(
  statement: string,
  options: RunSqlOptions = {},
): Promise<T[]> {
  const { timeoutMs = 8000, bindings = [], retries = 1 } = options;
  const url = `${baseUrl()}/api/v2/statements`;

  const body: Record<string, unknown> = {
    statement,
    timeout: Math.min(60, Math.ceil(timeoutMs / 1000)),
    database: env.database,
    schema: env.schema,
    warehouse: env.warehouse,
    role: env.role,
  };

  if (bindings.length > 0) {
    body.bindings = Object.fromEntries(
      bindings.map((value, index) => [
        String(index + 1),
        value === null
          ? { type: "TEXT", value: null }
          : typeof value === "number"
            ? { type: "REAL", value: String(value) }
            : typeof value === "boolean"
              ? { type: "BOOLEAN", value: String(value) }
              : { type: "TEXT", value },
      ]),
    );
  }

  let attempt = 0;
  for (;;) {
    const response = await requestWithTimeout(
      url,
      { method: "POST", headers: authHeaders(), body: JSON.stringify(body) },
      timeoutMs,
    );

    const json = (await response.json().catch(() => ({}))) as SqlApiResponse;

    if (response.ok && json.data) return toRows<T>(json);

    if (response.status === 202 && json.statementHandle) {
      const pollUrl = `${baseUrl()}/api/v2/statements/${json.statementHandle}?partition=0`;
      let polls = 0;
      while (polls < 4) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        polls += 1;
        const poll = await requestWithTimeout(
          pollUrl,
          { method: "GET", headers: authHeaders() },
          timeoutMs,
        );
        const pollJson = (await poll.json().catch(() => ({}))) as SqlApiResponse;
        if (poll.ok && pollJson.data) return toRows<T>(pollJson);
        if (pollJson.message && /fail|error/i.test(pollJson.message)) {
          throw new SnowflakeError(pollJson.message, pollJson.code ?? "query_failed", poll.status);
        }
      }
      throw new SnowflakeError("Snowflake statement still running", "timeout", 202);
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable && attempt < retries) {
      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
      continue;
    }

    if (response.status === 401 || response.status === 403) {
      throw new SnowflakeError("Snowflake rejected the credentials", "unauthorized", response.status);
    }
    if (response.status === 390 && /credit/i.test(json.message ?? "")) {
      throw new SnowflakeError("Snowflake credits exhausted", "credits_exhausted", 390);
    }

    throw new SnowflakeError(
      json.message ?? `Snowflake request failed with ${response.status}`,
      json.code ?? "query_failed",
      response.status,
    );
  }
}
