import common from "../common/base.mjs";

export default {
  ...common,
  key: "timetonic-new-table-row",
  name: "New Table Row",
  description: "Emit new event when a new table row is added in TimeTonic",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(row) {
      return {
        id: row.id,
        summary: `New Row with ID: ${row.id}`,
        ts: Date.now(),
      };
    },
    processRows(rows) {
      for (const row of rows) {
        const meta = this.generateMeta(row);
        this.$emit(row.fields, meta);
      }
    },
  },
};
