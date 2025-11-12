import base from "../common/base.mjs";

export default {
  ...base,
  key: "affinda-document-validated",
  name: "New Document Validated",
  description: "Emit new event when a document is validated in Affinda. [See docs here](https://docs.affinda.com/reference/createresthooksubscription)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getEventType() {
      return "document.validate.completed";
    },
  },
};
