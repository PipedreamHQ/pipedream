import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_sign-document-completed",
  name: "New Document Completed",
  description: "Emit new event when a document is completed.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortColumn() {
      return "modified_time";
    },
    isRelevant(doc) {
      return doc.request_status === "completed";
    },
    generateMeta(doc) {
      return {
        id: doc.request_id,
        summary: `Document ${doc.request_id} Completed`,
        ts: doc[this.sortColumn],
      };
    },
  },
};
