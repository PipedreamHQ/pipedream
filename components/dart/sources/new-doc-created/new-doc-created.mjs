import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dart-new-doc-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created in Dart.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dart.listDocs;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(doc) {
      return {
        id: doc.duid,
        summary: `New Document Created: ${doc.duid}`,
        ts: Date.parse(doc.createdAt),
      };
    },
  },
  sampleEmit,
};
