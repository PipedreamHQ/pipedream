import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "boldsign-new-document-sent",
  name: "New Document Sent",
  description: "Emit new event when a document is sent to a signer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.boldsign.listDocuments;
    },
    getSummary(item) {
      return `New Document Sent: ${item.documentId}`;
    },
    getParams() {
      return {
        status: "None",
        transmitType: "Sent",
      };
    },
  },
  sampleEmit,
};
