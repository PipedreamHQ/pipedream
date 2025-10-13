import mysql from "../../mysql.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "mysql-update-row",
  name: "Update Row",
  description:
    "Updates an existing row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/update.html)",
  type: "action",
  version: "2.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mysql,
    table: {
      description: "The table to update a row in",
      propDefinition: [
        mysql,
        "table",
      ],
      reloadProps: true,
    },
    condition: {
      propDefinition: [
        mysql,
        "whereCondition",
      ],
    },
    conditionValues: {
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async additionalProps() {
    return await this.getColumnProps(this.table);
  },
  methods: utils,
  async run({ $ }) {
    const {
      table, condition, conditionValues,
    } = this;
    const numberOfQuestionMarks = condition.match(/\?/g)?.length;

    if (!numberOfQuestionMarks) {
      throw new Error(
        "No valid condition provided. At least one question mark character ? must be provided.",
      );
    }

    if (!Array.isArray(conditionValues)) {
      throw new Error("Condition values is not an array.");
    }

    if (conditionValues.length !== numberOfQuestionMarks) {
      throw new Error(
        "The number of values provided does not match the number of question marks ? in the condition",
      );
    }

    const {
      columns: columnsToUpdate, values: valuesToUpdate,
    } =
      await this.getColumnAndValueArrays(table);

    const result = await this.mysql.updateRow({
      table,
      condition,
      conditionValues,
      columnsToUpdate,
      valuesToUpdate,
    });

    $.export(
      "$summary",
      `Successfully updated ${result.affectedRows} row(s) in table ${table}`,
    );

    return result;
  },
};
