import app from "../../logfire.app.mjs";

export default {
  key: "logfire-run-sql-query",
  name: "Run SQL Query",
  description:
    "Executes an arbitrary SQL query against Logfire's `records` (unified logs + traces, one row per span) or `metrics` tables and returns the results."
    + " Use this for any analysis, search, or aggregation over your telemetry — recent activity, error hunting, latency analysis, counts, etc."
    + " To discover what columns are available before writing a query, run `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'records'` (or `'metrics'`) with this same tool — there is no separate schema-discovery tool."
    + " Useful columns on `records` include `start_timestamp`, `span_name`, `message`, `level`, `service_name`, `duration`, `is_exception`, `exception_type`, and `exception_message`."
    + " Example — find exceptions: `SELECT span_name, exception_type, exception_message FROM records WHERE is_exception = true ORDER BY start_timestamp DESC`."
    + " Example — count by level: `SELECT level, count(*) AS n FROM records GROUP BY level ORDER BY n DESC`."
    + " After using **Record Log Entry** to write data, use this tool to confirm what was recorded."
    + " [See the SQL reference](https://pydantic.dev/docs/logfire/reference/sql/) and [query API docs](https://pydantic.dev/docs/logfire/manage/query-api/#making-direct-http-requests).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sql: {
      type: "string",
      label: "SQL Query",
      description: "The SQL query to run, e.g. `SELECT start_timestamp, message, level FROM records ORDER BY start_timestamp DESC LIMIT 20`.",
    },
    minTimestamp: {
      type: "string",
      label: "Min Timestamp",
      description: "ISO 8601 timestamp to bound the query's start time, e.g. `2025-01-15T00:00:00Z`. Defaults to 24 hours before now if not provided.",
      optional: true,
    },
    maxTimestamp: {
      type: "string",
      label: "Max Timestamp",
      description: "ISO 8601 timestamp to bound the query's end time, e.g. `2025-01-15T23:59:59Z`. Defaults to now if not provided.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of rows to return. Defaults to 100, max 10000.",
      optional: true,
      default: 100,
      min: 1,
      max: 10000,
    },
  },
  async run({ $ }) {
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const minTimestamp = this.minTimestamp || new Date(dayAgo).toISOString();
    const maxTimestamp = this.maxTimestamp || new Date().toISOString();
    const limit = this.limit || 100;

    const response = await this.app.runQuery({
      $,
      sql: this.sql,
      minTimestamp,
      maxTimestamp,
      limit,
    });

    const rowCount = response.data?.length || 0;
    $.export("$summary", `Query returned ${rowCount} row${rowCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
