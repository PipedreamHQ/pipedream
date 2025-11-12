import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/documents/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listDocuments;
    },
    getSummary(item) {
      return `New document created: ${item.name || item.id}`;
    },
  },
  sampleEmit,
};
