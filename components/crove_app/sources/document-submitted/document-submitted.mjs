import common from "../common.mjs";

export default {
  ...common,
  key: "crove_app-document-submitted",
  name: "Document Submitted",
  description: "Triggers when a document is submitted.",
  version: "1.0.3",
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
