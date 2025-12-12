import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "edusign-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created. [See the documentation](https://developers.edusign.com/reference/getdocuments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;

      const { result: { documents: resultDocuments } } = await this.edusign.listDocuments({
        params: {
          createdAfter: lastCreated,
        },
      });

      const documents = [];
      for (const document of resultDocuments) {
        if (Date.parse(document.DATE_CREATED) > Date.parse(lastCreated)) {
          documents.push(document);
          if (Date.parse(document.DATE_CREATED) > Date.parse(maxCreated)) {
            maxCreated = document.DATE_CREATED;
          }
        }
      }

      this._setLastCreated(maxCreated);

      if (!documents.length) {
        return;
      }

      if (max && documents.length > max) {
        documents.length = max;
      }

      documents.forEach((document) => {
        const meta = this.generateMeta(document);
        this.$emit(document, meta);
      });
    },
    generateMeta(document) {
      return {
        id: document.ID,
        summary: `New Document Created: ${document.NAME}`,
        ts: Date.parse(document.DATE_CREATED),
      };
    },
  },
  sampleEmit,
};
