const common = require("../common-table-scan");

module.exports = {
  ...common,
  key: "snowflake-new-row",
  name: "New Row",
  description: "Emit an event when a new row is added to a table",
  version: "0.0.1",
  methods: {
    ...common.methods,
    async getStatement(lastResultId) {
      const sqlText = `
        SELECT *
        FROM IDENTIFIER(:1)
        WHERE ${this.uniqueKey} > :2
        ORDER BY ${this.uniqueKey} ASC
      `;
      const binds = [
        this.tableName,
        lastResultId,
      ];
      return {
        sqlText,
        binds,
      };
    },
  },
};
