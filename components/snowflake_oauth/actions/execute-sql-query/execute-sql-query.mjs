import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  name: "Execute SQL Query",
  key: "snowflake_oauth-execute-sql-query",
  description: "Execute a custom Snowflake query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "snowflake_oauth",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    const args = this.snowflake.executeQueryAdapter(this.sql);

    const data = await this.snowflake.executeQuery(args);

    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);

    return data;
  },
};
