import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Delete Row(s)",
  key: "postgresql-delete-rows",
  description: "Deletes a row or rows from a table. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.1",
  type: "action",
  props: {
    postgresql,
    table: {
      propDefinition: [
        postgresql,
        "table",
      ],
    },
    column: {
      propDefinition: [
        postgresql,
        "column",
        (c) => ({
          table: c.table,
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
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      column,
      value,
    } = this;
    const rowCount = await this.postgresql.getRowCount(table);
    await this.postgresql.deleteRows(table, column, value);
    const newRowCount = await this.postgresql.getRowCount(table);
    const rowsDeleted = rowCount - newRowCount;
    $.export("$summary", `Deleted ${rowsDeleted} rows from ${table}`);
  },
};
