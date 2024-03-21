import mysql from "../../mysql_test.app.mjs";

export default {
  key: "mysql_test-execute-raw-query",
  name: "Execute Raw Query",
  description: "Find row(s) via a custom raw query",
  type: "action",
  version: "0.0.3",
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
