import common from "../common/polling.mjs";

export default {
  ...common,
  key: "algodocs-new-data-extracted",
  name: "New Data Extracted",
  description: "Emit new event when a document is processed and data is extracted. [See the documentation](https://api.algodocs.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Data Extracted: ${resource.fileName}`,
        ts: Date.parse(resource.processedAt),
      };
    },
  },
};
