import neon from "../../neon_postgres.app.mjs";

export default {
  name: "Delete Row(s)",
  key: "neon_postgres-delete-rows",
  description: "Deletes a row or rows from a table. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    const errorMsg = "Row not deleted due to an error. ";

    const rows = await this.neon.deleteRows(
      schema,
      table,
      column,
      value,
      errorMsg,
    );
    $.export("$summary", `Deleted ${rows.length} rows from ${table}`);
    return rows;
  },
};
