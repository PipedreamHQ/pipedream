import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Execute Custom Query",
  key: "postgresql-execute-custom-query",
  description: "Executes a custom query you provide. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.5",
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
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      values = [],
      rejectUnauthorized,
    } = this;

    if (!Array.isArray(values)) {
      throw new Error("No valid values provided. The values property must be an array.");
    }

    const numberOfValues = query?.match(/\$/g)?.length || 0;
    if (values.length !== numberOfValues) {
      throw new Error("The number of values provided does not match the number of values in the query.");
    }

    try {
      const res = await this.postgresql.executeQuery({
        text: query,
        values,
      }, rejectUnauthorized);
      $.export("$summary", "Successfully executed query");
      return res;
    } catch (error) {
      throw new Error(`
        Query not executed due to an error. ${error}.
        This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
      `);
    }
  },
};
