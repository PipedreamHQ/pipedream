import mysql from "../../mysql.app.mjs";

export default {
  name: "Execute MySQL Query",
  version: "0.0.1",
  key: "mysql-execute-sql-query",
  description: "Execute a custom MySQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  props: {
    mysql,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "mysql",
      },
      label: "MySQL Query",
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
