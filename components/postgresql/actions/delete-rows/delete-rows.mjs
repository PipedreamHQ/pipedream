import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Delete Row(s)",
  key: "postgresql-delete-rows",
  description: "Deletes a row or rows from a table. [See the documentation](https://node-postgres.com/features/queries)",
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
    column: {
      propDefinition: [
        postgresql,
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
        postgresql,
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
      const rows = await this.postgresql.deleteRows(
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
