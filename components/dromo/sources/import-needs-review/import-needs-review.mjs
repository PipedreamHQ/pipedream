import base from "../common/base.mjs";

export default {
  ...base,
  key: "dromo-import-needs-review",
  name: "Import Needs Review",
  description: "Emit new event when an import has issues and needs a review",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    generateMeta(importItem) {
      return {
        id: importItem.id,
        summary: `Import ${importItem.id} needs review`,
        ts: Date.parse(importItem.created),
      };
    },
  },
  async run() {
  },
};
