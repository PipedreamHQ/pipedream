const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-table",
  name: "New Table",
  description: "Emits an event when a new table is added to a database",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(connection) {
      const tables = await this.mysql.listTables(connection);
      this.iterateAndEmitEvents(tables);
    },
    generateMeta(table) {
      const { database } = this.mysql.$auth;
      const tableName = table[`Tables_in_${database}`];
      return {
        id: tableName,
        summary: tableName,
        ts: Date.now(),
      };
    },
  },
};