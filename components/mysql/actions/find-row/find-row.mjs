import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-find-row",
  name: "Find Row",
  description:
    "Finds a row in a table via a lookup column. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "action",
  version: "2.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mysql,
    table: {
      description: "The table to find a row in",
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
  async run({ $ }) {
    const {
      table, column, operator, value,
    } = this;

    const condition = `${column} ${operator} ?`;

    const result = await this.mysql.findRows({
      table,
      condition,
      values: [
        value,
      ],
    });

    $.export(
      "$summary",
      `Successfully found ${result.length} row(s) from table ${table}`,
    );

    return result;
  },
};
