import common from "../common/polling.mjs";

export default {
  ...common,
  key: "agiled-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listDocuments;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Document: ${resource.subject}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
