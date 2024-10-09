import common from "../common/polling.mjs";

export default {
  ...common,
  key: "algodocs-new-table-row-extracted",
  name: "New Table Row Extracted",
  description: "Emit new event when a new table row is extracted from a document. [See the documentation](https://api.algodocs.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      const { data } = resource;
      // It's a table row if any of the values are an array
      return Object.keys(data).some((key) => Array.isArray(data[key]));
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Table Row Extracted: ${resource.fileName}`,
        ts: Date.parse(resource.processedAt),
      };
    },
  },
};
