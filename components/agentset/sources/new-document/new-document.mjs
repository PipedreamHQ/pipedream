import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-new-document",
  name: "New Document Status",
  description: "Emit new event when a new document status is updated. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/documents/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listDocuments;
    },
    getSummary(item) {
      return `New Document: ${item.name || item.id}`;
    },
  },
  sampleEmit,
};
