import common from "../common.mjs";

export default {
  ...common,
  name: "New Column",
  key: "postgresql-new-column",
  description: "Emit new event when a new column is added to a table. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.5",
  type: "source",
  props: {
    ...common.props,
    schema: {
      propDefinition: [
        common.props.postgresql,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        common.props.postgresql,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
  },
  async run() {
    const previousColumns = this._getPreviousValues() || [];

    const columns = await this.postgresql.getColumns(this.table, this.schema);

    const newColumns = columns.filter((column) => !previousColumns.includes(column));
    for (const column of newColumns) {
      const meta = this.generateMeta(column);
      this.$emit(column, meta);
    }

    this._setPreviousValues(columns);
  },
};
