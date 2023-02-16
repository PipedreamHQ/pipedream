import common from "../common.mjs";

export default {
  ...common,
  key: "crove_app-document-submitted",
  name: "Document Submitted",
  description: "Triggers when a document is submitted.",
  version: "0.0.2",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "document.response.submitted",
      ];
    },
  },
};
