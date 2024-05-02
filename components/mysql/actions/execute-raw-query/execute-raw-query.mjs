import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-raw-query",
  name: "Execute Raw Query",
  description: "Find row(s) via a custom raw query. [See the documentation](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "action",
  version: "1.0.3",
  props: {
    mysql,
    sql: {
      type: "string",
      label: "Query",
      description: "The SQL query to execute",
    },
  },
  run() {
    return this.mysql.executeQuery({
      sql: this.sql,
    });
  },
};
