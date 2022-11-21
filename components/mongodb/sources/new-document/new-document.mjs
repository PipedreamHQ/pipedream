import common from "../common/base.mjs";

export default {
  ...common,
  key: "mongodb-new-document",
  name: "New Document",
  description: "Emit new an event when a new document is added to a collection",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    database: {
      propDefinition: [
        common.props.mongodb,
        "database",
      ],
    },
    collection: {
      propDefinition: [
        common.props.mongodb,
        "collection",
        (c) => ({
          database: c.database,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    _getDocumentIds() {
      return this.db.get("documentIds");
    },
    _setDocumentIds(documentIds) {
      this.db.set("documentIds", documentIds);
    },
    isRelevant(id, documentIds) {
      return !documentIds.includes(id);
    },
    async processEvent(client, ts) {
      const documentIds = this._getDocumentIds() || [];
      const collection = this.mongodb.getCollection(client, this.database, this.collection);
      const documents = await this.mongodb.listDocuments(collection);
      for (const doc of documents) {
        const id = JSON.stringify(doc._id);
        if (!this.isRelevant(id, documentIds)) {
          continue;
        }
        documentIds.push(id);
        this.emitEvent(doc, ts);
      }
      this._setDocumentIds(documentIds);
    },
    generateMeta({ _id: id }, ts) {
      return {
        id,
        summary: `New Document ID ${JSON.stringify(id)}`,
        ts,
      };
    },
  },
};
