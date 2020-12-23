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
      const entity = rowCount === 1 ? "row" : "rows";
      const summary = `${rowCount} new ${entity}`;
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(lastResultId, event) {
      this.validateColumn(this.uniqueKey);
      const sqlText = `
        SELECT *
        FROM IDENTIFIER(:1)
        WHERE ${this.uniqueKey} > :2
        ORDER BY :3 ASC
      `;
      const binds = [
        this.tableName,
        lastResultId,
        this.uniqueKey,
      ];
      const statement = {
        sqlText,
        binds,
      };

      const { timestamp } = event;
      return (this.eventSize === 1) ?
        this.processSingle(statement, timestamp) :
        this.processCollection(statement, timestamp);
    },
  },
};
