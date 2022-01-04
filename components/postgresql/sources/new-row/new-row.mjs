import common from "../common.mjs";

export default {
  ...common,
  name: "New Row",
  key: "postgresql-new-row",
  description: "Emit new event when a new row is added to a table",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    table: {
      propDefinition: [
        common.props.postgresql,
        "table",
      ],
    },
    column: {
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    /**
     * Sets lastResult in db. Since results are ordered by the specified column, we can assume the maximum
     * result for that column is in the first row returned.
     * @param {object} rows - The rows returned to be emitted.
     * @param {string} column - Name of the table column to order by
     */
    _setPreviousValues(rows, column) {
      if (rows.length) this.db.set("previousValues", rows[0][column]);
    },
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: "New Row Added",
        ts: Date.now(),
      }
    },
  },
  async run() {
    const {
      table,
      column,
    } = this;
    const lastResult = this._getPreviousValues() || null;
    const rows = await this.postgresql.getRows(table, column, lastResult);
    for (const row of rows) {
      const meta = this.generateMeta(row, column);
      this.$emit(row, meta);
    }
    this._setPreviousValues(rows, column);
  },
};
