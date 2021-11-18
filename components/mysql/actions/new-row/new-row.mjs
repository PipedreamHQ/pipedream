import commonTable from "../common/table.mjs";

const { mysql } = commonTable.props;

export default {
  ...commonTable,
  key: "mysql-new-row",
  name: "New Row",
  description: "Adds a new row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  type: "action",
  version: "0.0.1",
  props: {
    ...commonTable.props,
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
