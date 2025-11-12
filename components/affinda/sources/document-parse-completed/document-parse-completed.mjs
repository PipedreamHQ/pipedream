import base from "../common/base.mjs";

export default {
  ...base,
  key: "affinda-document-parse-completed",
  name: "New Document Parse Completed",
  description: "Emit new event when a document parsing is completed in Affinda [See docs here](https://docs.affinda.com/reference/createresthooksubscription)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    _getEventType() {
      return "document.parse.completed";
    },
  },
};
