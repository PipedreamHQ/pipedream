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
    table: { propDefinition: [common.props.mysql, "table"] },
  },
  methods: {
    ...common.methods,
    async listResults(connection) {
      const columns = await this.mysql.listColumns(connection, this.table);
      this.iterateAndEmitEvents(columns);
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