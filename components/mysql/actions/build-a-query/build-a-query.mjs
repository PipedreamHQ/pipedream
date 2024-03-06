import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-build-a-query",
  name: "Build A Query",
  description:
    "Use the Pipedream Query Builder to build a query to run in your workflow.",
  type: "action",
  version: "0.0.1",
  props: {
    mysql,
    query: {
      type: "query-builder-assisted-string",
      queryBuilderOpts: {
        schema: this.schema(),
        table: this.table(),
        column: this.column(),
      },
      label: "Query",
      description: "The SQL query to execute",
      default: "select * from mytable where id = @input_parameter",
    },
    schema: {
      hidden: true,
      propDefinition: [
        mysql,
        "database",
      ],
    },
    table: {
      hidden: true,
      description: "The tables for the Query Builder to display",
      propDefinition: [
        mysql,
        "table",
        (c) => ({
          database: c.schema,
        }),
      ],
    },
    column: {
      hidden: true,
      description: "The columns of table for the Query Builder to display",
      propDefinition: [
        mysql,
        "column",
        (c) => ({
          database: c.schema,
          table: c.table,
        }),
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
      table, condition, values,
    } = this;

    const numberOfQuestionMarks = condition?.match(/\?/g)?.length;

    if (!numberOfQuestionMarks) {
      throw new Error(
        "No valid condition provided. At least one question mark character ? must be provided.",
      );
    }

    if (!Array.isArray(values)) {
      throw new Error(
        "No valid values provided. The values property must be an array.",
      );
    }

    if (values.length !== numberOfQuestionMarks) {
      throw new Error(
        "The number of values provided does not match the number of question marks ? in the condition.",
      );
    }

    const result = await this.mysql.findRows({
      table,
      condition,
      values,
    });

    $.export(
      "$summary",
      `Successfully found ${result.length} row(s) from table ${table}`,
    );

    return result;
  },
};
