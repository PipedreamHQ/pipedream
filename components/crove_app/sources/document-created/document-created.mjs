import common from "../common.mjs";

export default {
  ...common,
  key: "crove_app-document-created",
  name: "Document Created",
  description: "Triggers when a new document is created.",
  version: "1.0.3",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "document.created",
      ];
    },
  },
};
