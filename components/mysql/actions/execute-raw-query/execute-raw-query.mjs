import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-raw-query",
  name: "Execute SQL Query",
  description: "Execute a custom MySQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "2.0.5",
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
  async run() {
    const data = await this.mysql.executeQuery({
      sql: this.sql.query,
      values: this.sql.values,
    });
    console.table(data);
    return data;
  },
};
