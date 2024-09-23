import turso from "../../turso.app.mjs";

export default {
  key: "turso-execute-query",
  name: "Execute SQL Query",
  description: "Execute a custom SQLite query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "0.0.2",
  props: {
    turso,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "turso",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    const args = this.turso.executeQueryAdapter(this.sql);
    const data = await this.turso.executeQuery({
      $,
      ...args,
    });
    $.export("$summary", `Returned ${data.rows.length} ${data.rows.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
