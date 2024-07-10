import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-raw-query",
  name: "Execute SQL Query",
  description: "Execute a custom MySQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "2.0.1",
  props: {
    mysql,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "mysql",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    const args = this.mysql.executeQueryAdapter(this.sql);
    const data = await this.mysql.executeQuery(args);
    $.export("$summary", `Returned ${data.length} ${data.length === 1
      ? "row"
      : "rows"}`);
    return data;
  },
};
