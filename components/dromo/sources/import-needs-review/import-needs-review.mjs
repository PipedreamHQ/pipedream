import base from "../common/base.mjs";

export default {
  ...base,
  key: "dromo-import-needs-review",
  name: "Import Needs Review",
  description: "Emit new event when a headless import has issues and needs a review",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.dromo.listHeadlessImports;
    },
    isRelevant(item) {
      return item.status === "NEEDS_REVIEW";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `Import ${item.id} needs review`,
        ts: Date.parse(item.modified_date),
      };
    },
  },
};
