import mysql from "../../mysql.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "mysql-create-row",
  name: "Create Row",
  description:
    "Adds a new row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  type: "action",
  version: "2.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  additionalProps() {
    return this.getColumnProps(this.table);
  },
  methods: utils,
  async run({ $ }) {
    const { table } = this;

    const {
      columns, values,
    } = await this.getColumnAndValueArrays(table);

    const result = await this.mysql.insertRow({
      table,
      columns,
      values,
    });

    $.export(
      "$summary",
      `Successfully added ${result.affectedRows} row(s) to table ${table}`,
    );

    return result;
  },
};
