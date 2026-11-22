import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

/**
 * Minimal emulator of the Snowflake SQL API, used to exercise SnowflakeStore
 * without a real account. Supports the MERGE and SELECT shapes in store.ts and
 * the asynchronous 202 + poll flow of the real API.
 *
 * Usage: node scripts/mock-snowflake.mjs [port]   (default 3222)
 * Then: SNOWFLAKE_ACCOUNT=mock SNOWFLAKE_USER=test SNOWFLAKE_TOKEN=test \
 *       SNOWFLAKE_HOST=http://localhost:3222 npx next start -p 3112
 */
const port = Number(process.argv[2] ?? 3222);
const tables = { ANALYSES: [], LEARNER_RESPONSES: [], PREPOST_TESTS: [] };
const pending = new Map();
const now = () => new Date().toISOString();

const COLUMNS = {
  ANALYSES: [
    "ID",
    "CREATED_AT",
    "TEXT_HASH",
    "EXCERPT",
    "CHANNEL",
    "LANGUAGE",
    "RISK_SCORE",
    "LABEL",
    "CATEGORY",
    "REFUSE",
    "DEGRADED",
    "CONFIDENCE",
    "LATENCY_MS",
    "MODEL_USED",
  ],
  LEARNER_RESPONSES: [
    "ID",
    "CREATED_AT",
    "SESSION_ID",
    "SCENARIO_ID",
    "CATEGORY",
    "DIFFICULTY",
    "VERDICT",
    "CORRECT",
  ],
  PREPOST_TESTS: ["ID", "CREATED_AT", "PHASE", "SCORE_PCT"],
};

function handleMerge(statement, bindings) {
  const value = (index) => bindings[String(index)]?.value ?? null;
  if (statement.includes("MERGE INTO ANALYSES")) {
    tables.ANALYSES.push({
      ID: value(1),
      CREATED_AT: now(),
      TEXT_HASH: value(2),
      EXCERPT: value(3),
      CHANNEL: value(4),
      LANGUAGE: value(5),
      RISK_SCORE: Number(value(6)),
      LABEL: value(7),
      CATEGORY: value(8),
      REFUSE: value(9) === true || value(9) === "true",
      DEGRADED: value(10) === true || value(10) === "true",
      CONFIDENCE: Number(value(11)),
      LATENCY_MS: Number(value(12)),
      MODEL_USED: value(13),
    });
    return;
  }
  if (statement.includes("MERGE INTO LEARNER_RESPONSES")) {
    tables.LEARNER_RESPONSES.push({
      ID: value(1),
      CREATED_AT: now(),
      SESSION_ID: value(2),
      SCENARIO_ID: value(3),
      CATEGORY: value(4),
      DIFFICULTY: value(5),
      VERDICT: value(6),
      CORRECT: value(7) === true || value(7) === "true",
    });
    return;
  }
  if (statement.includes("MERGE INTO PREPOST_TESTS")) {
    tables.PREPOST_TESTS.push({
      ID: value(1),
      CREATED_AT: now(),
      PHASE: value(2),
      SCORE_PCT: Number(value(3)),
    });
  }
}

function handleSelect(statement) {
  const table = Object.keys(COLUMNS).find((name) => statement.includes(`FROM ${name}`));
  if (!table) return { data: [], resultSetMetaData: { rowType: [{ name: "ID" }] } };
  const rows = tables[table];
  return {
    data: rows.map((row) => COLUMNS[table].map((column) => row[column])),
    resultSetMetaData: {
      rowType: COLUMNS[table].map((name) => ({ name, type: "TEXT", nullable: true })),
    },
  };
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);

  if (req.method === "GET" && url.pathname === "/__stats") {
    return send(res, 200, {
      analyses: tables.ANALYSES.length,
      practice: tables.LEARNER_RESPONSES.length,
      prepost: tables.PREPOST_TESTS.length,
    });
  }

  if (req.headers.authorization !== "Bearer test" && req.headers.authorization !== "Bearer mock-token") {
    return send(res, 401, { code: "390303", message: "Invalid OAuth access token." });
  }

  if (req.method === "POST" && url.pathname === "/api/v2/statements") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    let payload = {};
    try {
      payload = JSON.parse(raw);
    } catch {
      return send(res, 400, { code: "100037", message: "Malformed JSON." });
    }
    const statement = String(payload.statement ?? "");
    if (/INSERT|MERGE/i.test(statement)) {
      handleMerge(statement, payload.bindings ?? {});
      const handle = randomUUID();
      pending.set(handle, { data: [], resultSetMetaData: { rowType: [{ name: "number of rows inserted" }] } });
      return send(res, 202, {
        statementHandle: handle,
        statementStatusUrl: `/api/v2/statements/${handle}`,
        message: "Statement executed successfully.",
      });
    }
    const result = handleSelect(statement);
    return send(res, 200, { ...result, message: "Statement executed successfully." });
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/v2/statements/")) {
    const handle = url.pathname.split("/").pop();
    const result = pending.get(handle);
    if (!result) return send(res, 404, { code: "390201", message: "Statement not found." });
    pending.delete(handle);
    return send(res, 200, { ...result, message: "Statement executed successfully." });
  }

  send(res, 404, { code: "390404", message: "Not found" });
});

server.listen(port, () => {
  console.log(`mock Snowflake SQL API on http://localhost:${port}`);
});
