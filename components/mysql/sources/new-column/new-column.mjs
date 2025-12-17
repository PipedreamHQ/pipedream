import common from "../common/table.mjs";

export default {
  ...common,
  key: "mysql-new-column",
  name: "New Column",
  description:
    "Emit new event when you add a new column to a table. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/show-columns.html)",
  type: "source",
  version: "2.0.6",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
  },
  methods: {
    ...common.methods,
    _getPreviousColumns() {
      return this.db.get("previousColumns");
    },
    _setPreviousColumns(previousColumns) {
      this.db.set("previousColumns", previousColumns);
    },
    async listResults() {
      const { table } = this;
      let previousColumns = this._getPreviousColumns() || [];
      const columns = await this.mysql.listNewColumns({
        table,
        previousColumns,
      });
      this.iterateAndEmitEvents(columns);

      const newColumnNames = columns
        .map((column) => column.Field)
        .filter((c) => !previousColumns.includes(c));

      previousColumns = previousColumns.concat(newColumnNames);
      this._setPreviousColumns(previousColumns);
    },
    generateMeta(column) {
      const columnName = column.Field;
      return {
        id: `${columnName}${this.table}`,
        summary: columnName,
        ts: Date.now(),
      };
    },
  },
};
