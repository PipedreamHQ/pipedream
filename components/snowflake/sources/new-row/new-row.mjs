import common from "../common-table-scan.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-new-row",
  name: "New Row",
  description: "Emit new event when a row is added to a table",
  version: "0.2.2",
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
