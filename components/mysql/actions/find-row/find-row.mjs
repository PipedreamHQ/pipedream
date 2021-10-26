import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-find-row",
  name: "Find Row",
  description: "Finds a row in a table via a lookup column. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
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
    column: {
      description: "Select the column you want to filter by",
      propDefinition: [
        mysql,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    operator: {
      propDefinition: [
        mysql,
        "whereOperator",
      ],
    },
    value: {
      propDefinition: [
        mysql,
        "whereValue",
      ],
    },
  },
  async run() {
    const condition = `${this.column} ${this.operator} ?`;
    const values = [
      this.value,
    ];

    return await this.mysql.findRows({
      table: this.table,
      condition,
      values,
    });
  },
};
