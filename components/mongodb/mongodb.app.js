const MongoClient = require("mongodb").MongoClient;

module.exports = {
  type: "app",
  app: "mongodb",
  propDefinitions: {
    database: {
      type: "string",
      label: "Database",
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
      async options(opts) {
        const client = await this.getClient();
        const db = this.getDatabase(client, opts.database);
        const collections = await this.listCollections(db);
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
      async options(opts) {
        const client = await this.getClient();
        const db = this.getDatabase(client, opts.database);
        const collection = this.getCollection(db, opts.collection);
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
    getCollection(db, collectionName) {
      return db.collection(collectionName);
    },
    async listDatabases(client) {
      const db = this.getDatabase(client, "admin");
      const adminDb = await db.admin();
      const { databases } = await adminDb.listDatabases();
      return databases;
    },
    async listCollections(db) {
      return await db.listCollections().toArray();
    },
    async listDocuments(collection) {
      return await collection.find().toArray();
    },
  },
};
