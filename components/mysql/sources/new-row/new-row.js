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
      this.db.set("column", column);

      await this.listMax10RowResults(connection, column);
      await new Promise(resolve => { connection.connection.stream.on('close', resolve) });
    },
  },
  methods: {
    ...common.methods,
    async listResults(connection) {
      const column = this.db.get("column");
      await this.listRowResults(connection, column);
    },
    iterateAndEmitEvents(rows) {
      const column = this.db.get("column");
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