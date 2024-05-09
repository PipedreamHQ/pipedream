import common from "../common/base.mjs";

export default {
  ...common,
  key: "timetonic-row-deleted",
  name: "Row Deleted",
  description: "Emit new event when a row is deleted in a table.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getRowIds() {
      return this.db.get("rowIds") || [];
    },
    _setRowIds(rowIds) {
      this.db.set("rowIds", rowIds);
    },
    generateMeta(row) {
      return {
        id: row.id,
        summary: `Row with ID: ${row.id} Deleted`,
        ts: Date.now(),
      };
    },
    processRows(rows) {
      const previousRowIds = this._getRowIds();
      const currentRowIds = rows.map(({ id }) => id);
      for (const id of previousRowIds) {
        if (!currentRowIds.includes(id)) {
          const row = {
            id,
          };
          const meta = this.generateMeta(row);
          this.$emit(row, meta);
        }
      }
      this._setRowIds(currentRowIds);
    },
  },
};
