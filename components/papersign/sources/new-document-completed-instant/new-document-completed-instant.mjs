import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papersign-new-document-completed-instant",
  name: "New Document Completed (Instant)",
  description: "Emit new event when a document is completed, i.e., all signers have signed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "document.completed",
      ];
    },
    getSummary(body) {
      return `Document '${body.document_name}' completed`;
    },
  },
  sampleEmit,
};
