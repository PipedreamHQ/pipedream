import common from "../common/base.mjs";

export default {
  ...common,
  key: "mongodb-new-collection",
  name: "New Collection",
  description: "Emit new an event when a new collection is added to a database",
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
  },
  methods: {
    ...common.methods,
    _getCollectionIds() {
      return this.db.get("collectionIds");
    },
    _setCollectionIds(collectionIds) {
      this.db.set("collectionIds", collectionIds);
    },
    isRelevant(uuid, collectionIds) {
      return !collectionIds.includes(uuid);
    },
    async processEvent(client, ts) {
      const collectionIds = this._getCollectionIds() || [];
      const collections = await this.mongodb.listCollections(client, this.database);
      for (const collection of collections) {
        const uuid = JSON.stringify(collection.info.uuid);
        if (!this.isRelevant(uuid, collectionIds)) {
          continue;
        }
        collectionIds.push(uuid);
        this.emitEvent(collection, ts);
      }
      this._setCollectionIds(collectionIds);
    },
    generateMeta({
      info, name,
    }, ts) {
      return {
        id: info.uuid,
        summary: name,
        ts,
      };
    },
  },
};
