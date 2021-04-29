const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-table",
  name: "New Table",
  description: "Emits an event when a new table is added to a database",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const connection = await this.mysql.getConnection();
      const tables = await this.mysql.listTopTables(connection);
      this.iterateAndEmitEvents(tables);
      this._setLastResult(tables, "CREATE_TIME");
      await this.mysql.closeConnection(connection);
    },
  },
  methods: {
    ...common.methods,
    async listResults(connection) {
      const lastResult = this._getLastResult();
      const tables = await this.mysql.listBaseTables(connection, lastResult);
      this.iterateAndEmitEvents(tables);
      this._setLastResult(tables, "CREATE_TIME");
    },
    generateMeta({ TABLE_NAME: tableName, CREATE_TIME: createTime }) {
      return {
        id: tableName,
        summary: tableName,
        ts: Date.parse(createTime),
      };
    },
  },
};