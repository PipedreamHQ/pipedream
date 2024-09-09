import { axios } from "@pipedream/platform";
import agrello from "../../agrello.app.mjs";

export default {
  key: "agrello-new-document",
  name: "New Document Added to Folder",
  description: "Emit new event when a user adds a document to a specific folder. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    agrello,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Default to 15 minutes
      },
    },
    folderId: {
      propDefinition: [
        agrello,
        "folderId",
      ],
    },
  },
  methods: {
    _getLastDocumentId() {
      return this.db.get("lastDocumentId");
    },
    _setLastDocumentId(id) {
      return this.db.set("lastDocumentId", id);
    },
    async _getDocumentsInFolder(folderId) {
      const documents = await this.agrello.listDocuments();
      return documents.filter((doc) => doc.folderId === folderId);
    },
  },
  hooks: {
    async deploy() {
      const documents = await this._getDocumentsInFolder(this.folderId);
      documents.slice(0, 50).forEach((doc) => this.$emit(doc, {
        id: doc.id,
        summary: `New Document: ${doc.name}`,
        ts: Date.parse(doc.createdAt),
      }));
      if (documents.length > 0) {
        this._setLastDocumentId(documents[0].id);
      }
    },
    async activate() {
      // Add any activation logic here if needed
    },
    async deactivate() {
      // Add any deactivation logic here if needed
    },
  },
  async run() {
    const lastDocumentId = this._getLastDocumentId();
    const documents = await this._getDocumentsInFolder(this.folderId);
    const newDocuments = documents.filter((doc) => doc.id > lastDocumentId);

    newDocuments.forEach((doc) => this.$emit(doc, {
      id: doc.id,
      summary: `New Document: ${doc.name}`,
      ts: Date.parse(doc.createdAt),
    }));

    if (newDocuments.length > 0) {
      this._setLastDocumentId(newDocuments[0].id);
    }
  },
};
