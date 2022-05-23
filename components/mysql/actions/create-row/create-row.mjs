import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-create-row",
  name: "Create Row",
  description: "Adds a new row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  type: "action",
  version: "0.0.1",
  props: {
    mysql,
    table: {
      description: "The table to add a row to",
      propDefinition: [
        mysql,
        "table",
      ],
    },
    columns: {
      type: "string[]",
      description: "Select the columns you want to use to insert the values",
      propDefinition: [
        mysql,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    values: {
      description: "Set the values you want to insert on each column selected",
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      columns,
      values,
    } = this;

    if (columns.length !== values.length) {
      throw new Error("The number of columns doesn't match the number of values");
    }

    const result = await this.mysql.insertRow({
      table,
      columns,
      values,
    });

    $.export("$summary", `Successfully added ${result.affectedRows} row(s) to table ${table}`);

    return result;
  },
};
