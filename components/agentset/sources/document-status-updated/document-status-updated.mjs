import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "agentset-document-status-updated",
  name: "Document Status Updated",
  description: "Emit new event when a document status is updated. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/documents/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.agentset.listDocuments;
    },
    getSummary(item) {
      return `Document ${item.name || item.id} has a new status: ${item.status}`;
    },
  },
  sampleEmit,
};
