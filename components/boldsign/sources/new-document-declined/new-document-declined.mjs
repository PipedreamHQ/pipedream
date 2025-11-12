import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "boldsign-new-document-declined",
  name: "New Document Declined",
  description: "Emit new event when a document is declined by a signer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.boldsign.listDocuments;
    },
    getSummary(item) {
      return `Document Declined: ${item.documentId}`;
    },
    getParams() {
      return {
        status: "Declined",
      };
    },
  },
  sampleEmit,
};
