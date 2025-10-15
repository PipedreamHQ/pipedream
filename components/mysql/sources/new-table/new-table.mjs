import common from "../common.mjs";

export default {
  ...common,
  key: "mysql-new-table",
  name: "New Table",
  description:
    "Emit new event when a new table is added to a database. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "source",
  version: "2.0.6",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const tables = await this.mysql.listTopTables({
        maxCount: 10,
      });
      this.iterateAndEmitEvents(tables);
      this._setLastResult(tables, "CREATE_TIME");
    },
  },
  methods: {
    ...common.methods,
    async listResults() {
      const lastResult = this._getLastResult();
      const tables = lastResult
        ? await this.mysql.listBaseTables({
          lastResult,
        })
        : await this.mysql.listTopTables({
          maxCount: 10,
        });
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
