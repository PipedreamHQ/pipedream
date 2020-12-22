const common = require("../common-table-scan");

module.exports = {
  ...common,
  key: "snowflake-new-row",
  name: "New Row",
  description: "Emit an event when a new row is added to a table",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        row: {
          [this.uniqueKey]: id,
        },
        timestamp: ts,
      } = data;
      const summary = `New row: ${id}`;
      return {
        id,
        summary,
        ts,
      };
    },
    generateMetaForCollection(data) {
      const {
        lastResultId: id,
        rowCount,
        timestamp: ts,
      } = data;
      const summary = `${rowCount} new rows`;
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(lastResultId, event) {
      const { timestamp } = event;
      const sqlText = `
        SELECT *
        FROM ${this.tableName}
        WHERE ${this.uniqueKey} > ${lastResultId}
        ORDER BY ${this.uniqueKey}
      `;
      const statement = {
        sqlText,
      };

      return (this.eventSize === 1) ?
        this.processSingle(statement, timestamp) :
        this.processCollection(statement, timestamp);
    },
  },
};
