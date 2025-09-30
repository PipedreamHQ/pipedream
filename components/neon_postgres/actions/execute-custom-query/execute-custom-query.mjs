import neon from "../../neon_postgres.app.mjs";

export default {
  key: "neon_postgres-execute-custom-query",
  name: "Execute SQL Query",
  description: "Execute a custom PostgreSQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    neon,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "neon",
      },
      label: "PostgreSQL Query",
    },
  },
  async run({ $ }) {
    const args = this.neon.executeQueryAdapter(this.sql);
    const data = await this.neon.executeQuery(args);
    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
