import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-query",
  name: "Execute Query",
  description: "Find row(s) via a custom query. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "action",
  version: "0.0.1",
  props: {
    mysql,
    table: {
      propDefinition: [
        mysql,
        "table",
      ],
    },
    condition: {
      propDefinition: [
        mysql,
        "whereCondition",
      ],
    },
    values: {
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run() {
    return await this.mysql.findRows({
      table: this.table,
      condition: this.condition,
      values: this.values,
    });
  },
};
