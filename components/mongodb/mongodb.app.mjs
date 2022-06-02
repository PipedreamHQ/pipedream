import {
  MongoClient, ObjectID,
} from "mongodb";

export default {
  type: "app",
  app: "mongodb",
  propDefinitions: {
    database: {
      type: "string",
      label: "Database",
      description: "A MongoDB database",
      async options() {
        const client = await this.getClient();
        const databases = await this.listDatabases(client);
        await client.close();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return databases.map((db) => {
          return db.name;
        });
      },
    },
    collection: {
      type: "string",
      label: "Collection",
      description: "A MongoDB collection",
      async options(opts) {
        const client = await this.getClient();
        const collections = await this.listCollections(client, opts.database);
        await client.close();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return collections.map((collection) => {
          return collection.name;
        });
      },
    },
    document: {
      type: "string",
      label: "Document",
      description: "Select a document from the MongoDB database",
      async options(opts) {
        const client = await this.getClient();
        const collection = this.getCollection(client, opts.database, opts.collection);
        const documents = await this.listDocuments(collection);
        await client.close();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return documents.map((doc) => {
          return doc._id;
        });
      },
    },
  },
  methods: {
    _getConnectionUrl(replSet = true) {
      const {
        username,
        password,
        hostname,
      } = this.$auth;
      const protocol = replSet
        ? "mongodb+srv"
        : "mongodb";
      return `${protocol}://${username}:${password}@${hostname}`;
    },
    async getClient() {
      const url = this._getConnectionUrl();
      try {
        return await MongoClient.connect(url);
      } catch (err) {
        if (err.code === "ENOTFOUND") {
          // Last attempt to connect to the server
          const url = this._getConnectionUrl(false);
          return MongoClient.connect(url);
        }
        throw err;
      }
    },
    getDatabase(client, dbName) {
      return client.db(dbName);
    },
    getCollection(client, dbName, collectionName) {
      const db = this.getDatabase(client, dbName);
      return db.collection(collectionName);
    },
    async listDatabases(client) {
      const db = this.getDatabase(client, "admin");
      const adminDb = await db.admin();
      const { databases } = await adminDb.listDatabases();
      return databases;
    },
    async listCollections(client, dbName) {
      const db = this.getDatabase(client, dbName);
      return await db.listCollections().toArray();
    },
    async listDocuments(collection) {
      return await collection.find().toArray();
    },
    async createDocument(data, databaseName, collectionName) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.insertOne(data);
      await client.close();
      return doc;
    },
    async updateDocument(databaseName, collectionName, _id, data ) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.updateOne({
        _id: ObjectID(_id),
      }, {
        "$set": data,
      });
      await client.close();
      return doc;
    },
    async deleteDocumentById(databaseName, collectionName, _id) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.deleteOne({
        _id: ObjectID(_id),
      });
      await client.close();
      return doc;
    },
    async findDocumentById(databaseName, collectionName, _id) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.findOne({
        _id: ObjectID(_id),
      });
      await client.close();
      return doc;
    },
    async searchDocuments(databaseName, collectionName, filter = {}, options = {}) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.find(filter, options).toArray();
      await client.close();
      return doc;
    },
  },
};
