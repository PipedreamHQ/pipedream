import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-raw-query",
  name: "Execute Raw Query",
  description: "Find row(s) via a custom raw query",
  type: "action",
  version: "1.0.0",
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
