import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Delete Row(s)",
  key: "postgresql-delete-rows",
  description: "Deletes a row or rows from a table. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.10",
  type: "action",
  props: {
    postgresql,
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
    },
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
          rejectUnauthorized: c.rejectUnauthorized,
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
      rejectUnauthorized,
    } = this;

    try {
      const rows = await this.postgresql.deleteRows(
        schema,
        table,
        column,
        value,
        rejectUnauthorized,
      );
      $.export("$summary", `Deleted ${rows.length} rows from ${table}`);
      return rows;
    } catch (error) {
      throw new Error(`
      Row not deleted due to an error. ${error}.
      This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
    `);
    }
  },
};
