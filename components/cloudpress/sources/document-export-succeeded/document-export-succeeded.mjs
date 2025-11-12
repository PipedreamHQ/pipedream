import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudpress-document-export-succeeded",
  name: "Document Export Succeeded",
  description: "Emit new event when a document export succeeds in Cloudpress.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "document_export.succeeded",
      ];
    },
    getSummary({ data }) {
      return `${data.sourceDocumentTitle} export succeeded`;
    },
  },
  sampleEmit,
};
