import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_sign-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortColumn() {
      return "created_time";
    },
    generateMeta(doc) {
      return {
        id: doc.request_id,
        summary: `Document ${doc.request_id} Created`,
        ts: doc[this.sortColumn],
      };
    },
  },
};
