import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-update-row",
  name: "Update Row",
  description: "Updates an existing row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/update.html)",
  type: "action",
  version: "0.0.1",
  props: {
    mysql,
    table: {
      description: "The table to update a row in",
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
    conditionValues: {
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
    columnsToUpdate: {
      type: "string[]",
      description: "Select the columns you want to use to update the values",
      propDefinition: [
        mysql,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    valuesToUpdate: {
      description: "Set the values you want to update on each column selected",
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      condition,
      columnsToUpdate,
      valuesToUpdate,
      conditionValues,
    } = this;
    const numberOfQuestionMarks = condition.match(/\?/g)?.length;

    if (!numberOfQuestionMarks) {
      throw new Error("No valid condition provided. At least one question mark character ? must be provided.");
    }

    const isAllArrays = [
      conditionValues,
      columnsToUpdate,
      valuesToUpdate,
    ].every(Array.isArray);

    if (!isAllArrays) {
      throw new Error("Either condition values, columns to update or values to update is not an array.");
    }

    if (conditionValues.length !== numberOfQuestionMarks) {
      throw new Error("The number of values provided does not match the number of question marks ? in the condition");
    }

    if (!columnsToUpdate.length) {
      throw new Error("No columns to update provided");
    }

    if (columnsToUpdate.length !== valuesToUpdate.length) {
      throw new Error("The number of columns doesn't match with the number of values to update");
    }

    const result = await this.mysql.updateRow({
      table,
      condition,
      conditionValues,
      columnsToUpdate,
      valuesToUpdate,
    });

    $.export("$summary", `Successfully updated ${result.affectedRows} row(s) in table ${table}`);

    return result;
  },
};
