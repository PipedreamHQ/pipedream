import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_sign-document-signed",
  name: "New Document Signed",
  description: "Emit new event when a document has received a successful signature from all the required parties.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortColumn() {
      return "modified_time";
    },
    isRelevant(doc) {
      return doc.sign_percentage === 100;
    },
    generateMeta(doc) {
      return {
        id: doc.request_id,
        summary: `Document ${doc.request_id} Signed`,
        ts: doc[this.sortColumn],
      };
    },
  },
};
