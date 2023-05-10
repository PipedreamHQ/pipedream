import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Update Row",
  key: "postgresql-update-row",
  description: "Updates an existing row. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.9",
  type: "action",
  props: {
    postgresql,
    schema: {
      propDefinition: [
        postgresql,
        "schema",
        (c) => ({
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    table: {
      propDefinition: [
        postgresql,
        "table",
        (c) => ({
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
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
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
      label: "Lookup Column",
      description: "Find row to update by searching for a value in this column. Returns first row found",
    },
    value: {
      propDefinition: [
        postgresql,
        "value",
        (c) => ({
          table: c.table,
          column: c.column,
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
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
      schema,
      table,
      column,
      value,
      rowValues,
      rejectUnauthorized,
    } = this;
    try {
      const res = await this.postgresql.updateRow(
        schema,
        table,
        column,
        value,
        rowValues,
        rejectUnauthorized,
      );
      const summary = res
        ? "Row updated"
        : "Row not found";
      $.export("$summary", summary);
      return res;
    } catch (error) {
      throw new Error(`
      Row not updated due to an error. ${error}.
      This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
    `);
    }
  },
};
