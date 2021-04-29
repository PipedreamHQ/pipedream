const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-row",
  name: "New Row",
  description: "Emits an event when you add a new row to a table",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    table: { propDefinition: [common.props.mysql, "table"] },
    column: {
      propDefinition: [
        common.props.mysql,
        "column",
        (c) => ({ table: c.table }),
      ],
      optional: true,
    },
  },
  hooks: {
    /** If column prop is left blank, get the table's primary key to use for ordering and deduping. */
    async deploy() {
      const connection = await this.mysql.getConnection();
      let column = this.column;
      if (!column) {
        const keyData = await this.mysql.getPrimaryKey(connection, this.table);
        column = keyData[0].Column_name;
      }
      this._setColumn(column);

      await this.listTopRows(connection, column);
      await this.mysql.closeConnection(connection);
    },
  },
  methods: {
    ...common.methods,
    _getColumn() {
      return this.db.get("column");
    },
    _setColumn(column) {
      this.db.set("column", column);
    },
    async listResults(connection) {
      const column = this._getColumn();
      await this.listRowResults(connection, column);
    },
    iterateAndEmitEvents(rows) {
      const column = this._getColumn();
      for (const row of rows) {
        const meta = this.generateMeta(row, column);
        this.$emit(row, meta);
      }
    },
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: `New Row Added ${column}: ${row[column]}`,
        ts: Date.now(),
      };
    },
  },
};