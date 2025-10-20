import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  type: "source",
  key: "dart-new-doc-updated",
  name: "New Document Updated",
  description: "Emit new event when any document is updated.",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dart.listDocs;
    },
    getTsField() {
      return "updatedAt";
    },
    generateMeta(doc) {
      const ts = Date.parse(doc.updatedAt);
      return {
        id: `${doc.duid}-${ts}`,
        summary: `Document Updated ${doc.duid}`,
        ts,
      };
    },
  },
  sampleEmit,
};
