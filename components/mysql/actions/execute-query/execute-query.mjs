import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-execute-query",
  name: "Execute Query",
  description: "Find row(s) via a custom query. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "action",
  version: "2.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mysql,
    table: {
      description: "The table where the query will be executed",
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
  async run({ $ }) {
    const {
      table,
      condition,
      values,
    } = this;

    const numberOfQuestionMarks = condition?.match(/\?/g)?.length;

    if (!numberOfQuestionMarks) {
      throw new Error("No valid condition provided. At least one question mark character ? must be provided.");
    }

    if (!Array.isArray(values)) {
      throw new Error("No valid values provided. The values property must be an array.");
    }

    if (values.length !== numberOfQuestionMarks) {
      throw new Error("The number of values provided does not match the number of question marks ? in the condition.");
    }

    const result = await this.mysql.findRows({
      table,
      condition,
      values,
    });

    $.export("$summary", `Successfully found ${result.length} row(s) from table ${table}`);

    return result;
  },
};
