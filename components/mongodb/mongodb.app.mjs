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
      description: "Select a document from the MongoDB database",
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
    async listCollections(db) {
      return await db.listCollections().toArray();
    },
    async listDocuments(collection) {
      return await collection.find().toArray();
    },
    async createDocument(
      data,
      databaseName,
      collectionName,
      parseNumbers,
      parseBooleans,
      parseDates,
    ) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.insertOne(this.parseStrings(
        data,
        parseNumbers,
        parseBooleans,
        parseDates,
      ));
      await client.close();
      return doc;
    },
    async updateDocument(
      databaseName,
      collectionName,
      _id,
      data,
      parseNumbers,
      parseBooleans,
      parseDates,
    ) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.updateOne({
        _id: ObjectID(_id),
      }, {
        "$set": this.parseStrings(
          data,
          parseNumbers,
          parseBooleans,
          parseDates,
        ),
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
    async searchDocuments(databaseName, collectionName, filter = {}) {
      const client = await this.getClient();
      const collection = this.getCollection(client, databaseName, collectionName);
      const doc = await collection.find(filter).toArray();
      await client.close();
      return doc;
    },
    parseFilter(filter) {
      const data = this.parseStrings(filter, true, true, true);
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        if (typeof data[keys[i]] !== "string") {
          continue;
        }
        if (data[keys[i]] === "null") {
          data[keys[i]] = null;
        }
        if (this.isObject(data[keys[i]])) {
          data[keys[i]] = JSON.parse(data[keys[i]]);
        }
      }
      return data;
    },
    parseStrings(dataParam, parseNumbers, parseBooleans, parseDates) {
      const data = {
        ...dataParam,
      };

      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        if (parseBooleans && this.isBooleanString(data[keys[i]])) {
          data[keys[i]] = this.parseBoolean(data[keys[i]]);
          continue;
        }

        if (parseDates && this.isDate(data[keys[i]])) {
          data[keys[i]] = new Date(data[keys[i]]);
          continue;
        }

        if (parseNumbers && !isNaN(data[keys[i]])) {
          data[keys[i]] = parseFloat(data[keys[i]]);
          continue;
        }
      }

      return data;
    },
    parseBoolean(string) {
      switch (string.toLowerCase().trim()) {
      case "true":
      case "1":
      case 1:
        return true;

      case "false":
      case "0":
      case 0:
        return false;
      }
    },
    isBooleanString(string) {
      switch (string.toLowerCase().trim()) {
      case "true":
      case "1":
      case 1:
      case "false":
      case "0":
      case 0:
        return true;

      default:
        return false;
      }
    },
    isDate(str) {
      return !isNaN(new Date(str).getDate());
    },
    isObject(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};
