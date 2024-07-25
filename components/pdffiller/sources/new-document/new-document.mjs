import { axios } from "@pipedream/platform";
import pdffiller from "../../pdffiller.app.mjs";

export default {
  key: "pdffiller-new-document",
  name: "New Document Created",
  description: "Emit new event when a new document is uploaded or created. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/zmnt034fyekxf-pdf-filler-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pdffiller,
    db: "$.service.db",
    documentId: {
      propDefinition: [
        pdffiller,
        "documentId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
      },
    },
  },
  methods: {
    _getLastDocumentId() {
      return this.db.get("lastDocumentId");
    },
    _setLastDocumentId(id) {
      this.db.set("lastDocumentId", id);
    },
    async _getDocuments() {
      return this.pdffiller._makeRequest({
        method: "GET",
        path: "/templates",
      });
    },
    async _searchDocumentsByName(name) {
      return this.pdffiller.searchDocumentsByName({
        name,
      });
    },
  },
  hooks: {
    async deploy() {
      const documents = await this._getDocuments();
      documents.slice(0, 50).forEach((document) => {
        this.$emit(document, {
          id: document.id,
          summary: `New Document: ${document.name}`,
          ts: Date.parse(document.date_created),
        });
      });
      if (documents.length > 0) {
        this._setLastDocumentId(documents[0].id);
      }
    },
    async activate() {
      const callbackUrl = "https://api.pipedream.com/source/webhook/your-webhook-id";
      await this.pdffiller.createCallback({
        documentId: this.documentId,
        eventId: "document.created",
        callbackUrl,
      });
    },
    async deactivate() {
      // No specific deactivation logic for this source
    },
  },
  async run() {
    const lastDocumentId = this._getLastDocumentId();
    const documents = await this._searchDocumentsByName("");
    for (const document of documents) {
      if (document.id === lastDocumentId) break;
      this.$emit(document, {
        id: document.id,
        summary: `New Document: ${document.name}`,
        ts: Date.parse(document.date_created),
      });
    }
    if (documents.length > 0) {
      this._setLastDocumentId(documents[0].id);
    }
  },
};
