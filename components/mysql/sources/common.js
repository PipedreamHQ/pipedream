const mysql = require("../mysql.app.js");

module.exports = {
  props: {
    mysql,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    _getLastResult() {
      return this.db.get("lastResult");
    },
    /**
     * Sets lastResult in db. Since results are ordered by the specified column, we can assume the maximum
     * result for that column is in the first row returned.
     * @param {object} rows - The rows returned to be emitted.
     * @param {string} column - Name of the table column to order by
     */
    _setLastResult(rows, column) {
      if (rows.length) this.db.set("lastResult", rows[0][column]);
    },
    iterateAndEmitEvents(results) {
      for (const result of results) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    },
    /**
     * Used by components that call listRows(). Gets lastResult, gets rows, sets lastResult, and returns rows.
     * @param {object} connection - The database connection.
     * @param {string} column - Name of the table column to order by
     */
    async listRowResults(connection, column) {
      let lastResult = this._getLastResult();
      const rows = await this.mysql.listRows(
        connection,
        this.table,
        column,
        lastResult
      );
      this._setLastResult(rows, column);
      this.iterateAndEmitEvents(rows);
    },
    async listMax10RowResults(connection, column) {
      const rows = await this.mysql.listMax10Rows(
        connection,
        this.table,
        column
      );
      this._setLastResult(rows, column);
      this.iterateAndEmitEvents(rows);
    },
  },
  async run(event) {
    const connection = await this.mysql.getConnection();

    const results = await this.listResults(connection);

    await connection.end();
  },
};