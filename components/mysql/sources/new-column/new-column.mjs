import common from "../common.mjs";

export default {
  ...common,
  key: "mysql-new-column",
  name: "New Column",
  description: "Emit new event when you add a new column to a table",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    table: {
      propDefinition: [
        common.props.mysql,
        "table",
      ],
    },
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
      let previousColumns = this._getPreviousColumns() || [];
      const columns = await this.mysql.listNewColumns(
        this.table,
        previousColumns,
      );
      this.iterateAndEmitEvents(columns);

      const newColumnNames =
        columns
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
