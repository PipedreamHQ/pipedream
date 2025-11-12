import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "documenso-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "createdAt";
    },
    generateMeta(doc) {
      return {
        id: doc.id,
        summary: `New Document Created: ${doc.id}`,
        ts: Date.parse(doc[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
