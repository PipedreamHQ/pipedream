import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pdffiller-new-document",
  name: "New Document Created",
  description: "Emit new event when a new document is uploaded or created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.pdffiller.listDocuments;
    },
    getSummary(item) {
      return `New Document: ${item.name}`;
    },
  },
  sampleEmit,
};
