import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "docugenerate-new-document-created",
  name: "New Document",
  description: "Emit new event when a document is created for a template. [See the documentation](https://api.docugenerate.com/#/Document/queryDocuments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    templateId: {
      propDefinition: [
        common.props.docugenerate,
        "templateId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.docugenerate.listDocuments;
    },
    getArgs() {
      return {
        templateId: this.templateId,
      };
    },
    generateMeta(doc) {
      return {
        id: doc.id,
        summary: `New document: ${doc.name || doc.id}`,
        ts: doc.created,
      };
    },
  },
  sampleEmit,
};
