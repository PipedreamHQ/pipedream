import postgresql from "../postgresql.app.mjs";
import format from "pg-format";

export default {
  props: {
    postgresql,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
      optional: true,
    },
  },
  methods: {
    _getPreviousValues() {
      return this.db.get("previousValues");
    },
    _setPreviousValues(previousValues) {
      this.db.set("previousValues", previousValues);
    },
    _getLastResult() {
      return this.db.get("lastResult");
    },
    /**
     * Sets lastResult in db. Since results are ordered by the specified column,
     * we can assume the maximum result for that column is in the first row returned.
     * @param {object} rows - The rows returned to be emitted.
     * @param {string} column - Name of the table column to order by
     */
    _setLastResult(rows, column) {
      if (rows.length) this.db.set("lastResult", rows[0][column]);
    },
    generateMeta(result) {
      return {
        id: result,
        summary: result,
        ts: Date.now(),
      };
    },
    /**
     * For sources that emit new rows. Retrieves new rows since lastResult of dedupe column,
     * emits new rows found, and sets lastResult for next run.
     * @param {object} table - Name of the table to get rows from.
     * @param {string} column - Name of the table column to order by
     * @param {boolean} [useLastResult] - Determines whether to return only rows
     * created since lastResult
     */
    async newRows(table, column, useLastResult = true) {
      const lastResult = useLastResult
        ? (this._getLastResult() || null)
        : null;
      const rows = await this.postgresql.getRows(
        table,
        column,
        lastResult,
        this.rejectUnauthorized,
      );
      this.emitRows(rows, column);
    },
    async initialRows(table, column, limit) {
      const rows = await this.postgresql.getInitialRows(table, column, limit);
      this.emitRows(rows, column);
    },
    emitRows(rows, column) {
      for (const row of rows) {
        const meta = this.generateMeta(row, column);
        this.$emit(row, meta);
      }
      this._setLastResult(rows, column);
    },
    async isColumnUnique(table, column) {
      const query = format("select count(*) <> count(distinct %I) as duplicate_flag from %I", column, table);
      const hasDuplicates = await this.postgresql.executeQuery(query);
      const { duplicate_flag: duplicateFlag } = hasDuplicates[0];
      return !duplicateFlag;
    },
  },
};
