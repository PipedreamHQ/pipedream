import snowflake from "../../snowflake.app.mjs";

export default {
  type: "action",
  ai: "optimized",
  key: "snowflake-execute-sql-query-in-session",
  name: "Execute SQL Query In Session",
  description: "Execute a Snowflake query inside a session started by the **Start SQL Session** action, so it shares that session's state — temporary tables, `USE` context, and session parameters — with the other queries in the same session. Pass the serialized session from Start SQL Session to the **Session** prop. Note: to preserve the session this query runs on a direct connection and therefore does NOT egress from the shared static IP (`use_pd_sql_proxy`); if your Snowflake network policy allowlists only the static IP, use **Execute SQL Query** instead. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    session: {
      propDefinition: [
        snowflake,
        "session",
      ],
      optional: false,
    },
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "snowflake",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    this.snowflake.restoreSession(this.session);

    const args = this.snowflake.executeQueryAdapter(this.sql);

    // executeQueryDirect() runs on the restored connection, bypassing the SQL
    // proxy (which is stateless and would open a new session per request),
    // so this query sees the session's temp tables / USE context / params.
    const data = await this.snowflake.executeQueryDirect(args);

    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);

    return data;
  },
};
