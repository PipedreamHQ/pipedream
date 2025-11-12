import common from "../common.mjs";

export default {
  ...common,
  key: "crove_app-document-completed",
  name: "Document Completed",
  description: "Triggers when a document is completed.",
  version: "1.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "document.completed",
      ];
    },
  },
};
