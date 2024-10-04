import nile from "../../nile_database.app.mjs";

export default {
  name: "Execute Query",
  key: "nile_database-execute-query",
  description: "Execute a custom PostgreSQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nile,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "nile",
      },
      label: "PostreSQL Query",
    },
  },
  async run({ $ }) {
    const args = this.nile.executeQueryAdapter(this.sql);
    const data = await this.nile.executeQuery(args);
    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
