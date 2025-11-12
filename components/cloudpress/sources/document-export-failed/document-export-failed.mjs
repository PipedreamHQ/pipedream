import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudpress-document-export-failed",
  name: "Document Export Failed",
  description: "Emit new event when a document export fails in Cloudpress.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "document_export.failed",
      ];
    },
    getSummary({ data }) {
      return `${data.sourceDocumentTitle} export failed`;
    },
  },
  sampleEmit,
};
