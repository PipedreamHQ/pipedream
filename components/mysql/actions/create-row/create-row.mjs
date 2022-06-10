import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-create-row",
  name: "Create Row",
  description: "Adds a new row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  type: "action",
  version: "0.0.2",
  props: {
    mysql,
    table: {
      description: "The table to add a row to",
      propDefinition: [
        mysql,
        "table",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const columns = await this.mysql.listColumnNames(this.table);
    for (const column of columns) {
      props[column] = {
        type: "string",
        label: column,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const { table } = this;

    const columns = [];
    const values = [];
    const columnNames = await this.mysql.listColumnNames(table);
    for (const column of columnNames) {
      if (this[column]) {
        columns.push(column);
        values.push(this[column]);
      }
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
