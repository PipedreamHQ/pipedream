import common from "../common.mjs";

export default {
  ...common,
  key: "mysql-new-table",
  name: "New Table",
  description: "Emit new event when a new table is added to a database",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const tables = await this.mysql.listTopTables();
      this.iterateAndEmitEvents(tables);
      this._setLastResult(tables, "CREATE_TIME");
    },
  },
  methods: {
    ...common.methods,
    async listResults() {
      const lastResult = this._getLastResult();
      const tables = await this.mysql.listBaseTables(lastResult);
      this.iterateAndEmitEvents(tables);
      this._setLastResult(tables, "CREATE_TIME");
    },
    generateMeta({
      TABLE_NAME: tableName, CREATE_TIME: createTime,
    }) {
      return {
        id: tableName,
        summary: tableName,
        ts: Date.parse(createTime),
      };
    },
  },
};
