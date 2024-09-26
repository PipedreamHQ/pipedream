import common from "../common/base.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "timetonic-row-updated",
  name: "Row Updated",
  description: "Emit new event when a row is updated in a table.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousRows() {
      return this.db.get("previousRows") || {};
    },
    _setPreviousRows(previousRows) {
      this.db.set("previousRows", previousRows);
    },
    generateMeta(row) {
      const ts = Date.now();
      return {
        id: `${row.id}${ts}`,
        summary: `Row Updated with ID: ${row.id}`,
        ts,
      };
    },
    processRows(rows) {
      const previousRows = this._getPreviousRows();
      for (const row of rows) {
        const hash = md5(JSON.stringify(row.fields));
        if (previousRows[row.id] !== hash) {
          const meta = this.generateMeta(row);
          this.$emit(row.fields, meta);
          previousRows[row.id] = hash;
        }
      }
      this._setPreviousRows(previousRows);
    },
  },
};
