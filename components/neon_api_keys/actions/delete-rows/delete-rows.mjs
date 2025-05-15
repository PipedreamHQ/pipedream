import neon from "../../neon_api_keys.app.mjs";

export default {
  name: "Delete Row(s)",
  key: "neon_api_keys-delete-rows",
  description: "Deletes a row or rows from a table. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.1",
  type: "action",
  props: {
    neon,
    schema: {
      propDefinition: [
        neon,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        neon,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    column: {
      propDefinition: [
        neon,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
      label: "Lookup Column",
      description: "Find row(s) by searching for a value in this column",
    },
    value: {
      propDefinition: [
        neon,
        "value",
        (c) => ({
          table: c.table,
          column: c.column,
          schema: c.schema,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      schema,
      column,
      value,
    } = this;

    try {
      const rows = await this.neon.deleteRows(
        schema,
        table,
        column,
        value,
      );
      $.export("$summary", `Deleted ${rows.length} rows from ${table}`);
      return rows;
    } catch (error) {
      let errorMsg = "Row not deleted due to an error. ";
      errorMsg += `${error}`.includes("SSL verification failed")
        ? "This could be because SSL verification failed. To resolve this, reconnect your account and set SSL Verification Mode: Skip Verification, and try again."
        : `${error}`;
      throw new Error(errorMsg);
    }
  },
};
