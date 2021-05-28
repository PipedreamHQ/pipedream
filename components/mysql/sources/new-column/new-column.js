const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-column",
  name: "New Column",
  description: "Emits an event when you add a new column to a table",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    table: { propDefinition: [common.props.mysql, "table"] },
  },
  methods: {
    ...common.methods,
    _getPreviousColumns() {
      return this.db.get("previousColumns");
    },
    _setPreviousColumns(previousColumns) {
      this.db.set("previousColumns", previousColumns);
    },
    async listResults(connection) {
      let previousColumns = this._getPreviousColumns() || [];
      const columns = await this.mysql.listNewColumns(
        connection,
        this.table,
        previousColumns
      );
      this.iterateAndEmitEvents(columns);

      const columnNames = columns.map((column) => column.Field);
      const newColumnNames = columnNames.filter(
        (c) => !previousColumns.includes(c)
      );
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