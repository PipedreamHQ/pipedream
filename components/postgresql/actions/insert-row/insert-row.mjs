import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Insert Row",
  key: "postgresql-insert-row",
  description: "Adds a new row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.6",
  type: "action",
  props: {
    postgresql,
    schema: {
      propDefinition: [
        postgresql,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        postgresql,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      rowValues,
    } = this;
    const columns = Object.keys(rowValues);
    const values = Object.values(rowValues);
    try {
      const res = await this.postgresql.insertRow(
        schema,
        table,
        columns,
        values,
      );
      $.export("$summary", "New row inserted");
      return res;
    } catch (error) {
      let errorMsg = "New row not inserted due to an error. ";
      errorMsg += `${error}`.includes("SSL verification failed")
        ? "This could be because SSL verification failed. To resolve this, reconnect your account and set SSL Verification Mode: Skip Verification, and try again."
        : `${error}`;
      throw new Error(errorMsg);
    }
  },
};
