import base from "../common/base.mjs";

export default {
  ...base,
  key: "dromo-new-data-row-imported",
  name: "New Data Row Imported",
  description: "Emits a new event when a headless import has been completed successfully.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.dromo.listHeadlessImports;
    },
    isRelevant(item) {
      return item.status === "SUCCESSFUL";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Data Row Imported: ${item.original_filename}`,
        ts: Date.parse(item.modified_date),
      };
    },
  },
};
