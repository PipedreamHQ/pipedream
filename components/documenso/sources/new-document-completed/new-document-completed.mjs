import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "documenso-new-document-completed",
  name: "New Document Completed",
  description: "Emit new event when a document is signed by all recipients.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "updatedAt";
    },
    isRelevant(doc) {
      return doc.status === "COMPLETED";
    },
    generateMeta(doc) {
      return {
        id: doc.id,
        summary: `New Document Completed: ${doc.id}`,
        ts: Date.parse(doc[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
