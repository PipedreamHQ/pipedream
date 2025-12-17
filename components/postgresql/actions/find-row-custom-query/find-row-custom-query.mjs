import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Find Row With Custom Query",
  key: "postgresql-find-row-custom-query",
  description: "Finds a row in a table via a custom query. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postgresql,
    query: {
      propDefinition: [
        postgresql,
        "query",
      ],
    },
    values: {
      propDefinition: [
        postgresql,
        "values",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      values = [],
    } = this;

    if (!Array.isArray(values)) {
      throw new Error("No valid values provided. The values property must be an array.");
    }

    if (this.values) {
      const numberOfValues = query?.match(/\$/g)?.length || 0;
      if (values.length !== numberOfValues) {
        throw new Error("The number of values provided does not match the number of values in the query.");
      }
    }

    if (!query.toLowerCase().includes("select")) {
      throw new Error("Need be a `SELECT` statement query. Read more about [SELECT queries here](https://www.w3schools.com/sql/sql_select.asp)");
    }

    const res = await this.postgresql.executeQuery({
      text: query,
      values,
      errorMsg: "Query not executed due to an error. ",
    });
    $.export("$summary", "Successfully executed query");
    return res;
  },
};
