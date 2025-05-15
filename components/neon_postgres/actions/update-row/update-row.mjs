import neon from "../../neon_postgres.app.mjs";

export default {
  name: "Update Row",
  key: "neon_api_keys-update-row",
  description: "Updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
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
      description: "Find row to update by searching for a value in this column. Returns first row found",
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
    rowValues: {
      propDefinition: [
        neon,
        "rowValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      column,
      value,
      rowValues,
    } = this;
    try {
      const res = await this.neon.updateRow(
        schema,
        table,
        column,
        value,
        rowValues,
      );
      const summary = res
        ? "Row updated"
        : "Row not found";
      $.export("$summary", summary);
      return res;
    } catch (error) {
      let errorMsg = "Row not updated due to an error. ";
      errorMsg += `${error}`.includes("SSL verification failed")
        ? "This could be because SSL verification failed. To resolve this, reconnect your account and set SSL Verification Mode: Skip Verification, and try again."
        : `${error}`;
      throw new Error(errorMsg);
    }
  },
};
