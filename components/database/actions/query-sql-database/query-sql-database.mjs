import postgresql from "../../../postgresql/postgresql.app.mjs";

export default {
  name: "Query SQL Database",
  key: "database-query-sql-database",
  description: "Execute a SQL Database. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  version: "0.0.1",
  type: "action",
  props: {
    postgresql,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "postgresql",
      },
      label: "PostreSQL Query",
    },
  },
  async run({ $ }) {
    const args = this.postgresql.executeQueryAdapter(this.sql);
    const data = await this.postgresql.executeQuery(args);
    const rowLabel = data.length === 1 ? "row" : "rows";
    $.export("$summary", `Returned ${data.length} ${rowLabel}`);
    return data;
  },
};
