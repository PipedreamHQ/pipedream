import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Execute Custom Query",
  key: "postgresql-execute-custom-query",
  description: "Executes a custom query you provide. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.1",
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

    const numberOfValues = query?.match(/\$/g)?.length || 0;
    if (values.length !== numberOfValues) {
      throw new Error("The number of values provided does not match the number of values in the query.");
    }

    const res = await this.postgresql.executeQuery({
      text: query,
      values,
    });
    $.export("$summary", "Successfully executed query");
    return res;
  },
};
