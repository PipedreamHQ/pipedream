import base from "../common/base.mjs";

export default {
  ...base,
  key: "dromo-new-data-row-imported",
  name: "New Data Row Imported",
  description: "Emits a new event when an import has been completed successfully.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    generateMeta(recentImport) {
      return {
        id: recentImport.id,
        summary: `New Data Row Imported: ${recentImport.original_filename}`,
        ts: Date.parse(recentImport.created_date),
      };
    },
  },
  async run() {
  },
};
