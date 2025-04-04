import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ragie-new-document",
  name: "New Ragie Document Created",
  description: "Emit new event whenever a new document is created in Ragie. [See the documentation](https://docs.ragie.ai/reference/listdocuments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.ragie.listDocuments;
    },
    getFieldName() {
      return "documents";
    },
    getSummary(document) {
      return `New Ragie Document: ${document.name || document.id}`;
    },
  },
  sampleEmit,
};
