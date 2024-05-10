import common from "../common/base.mjs";

export default {
  ...common,
  key: "timetonic-new-table-row-in-view",
  name: "New Table Row in View",
  description: "Emit new event when a new table row appears in a specific view.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.timetonic,
        "viewId",
        (c) => ({
          bookCode: c.bookCode,
          tableId: c.tableId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(row) {
      return {
        id: row.id,
        summary: `New Row in View with ID: ${row.id}`,
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
