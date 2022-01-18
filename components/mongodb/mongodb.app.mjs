import mongoose from "mongoose";

export default {
  type: "app",
  app: "mongodb",
  propDefinitions: {
    collection: {
      label: "Collection",
      type: "string",
      description: "Collection where the new document will be inserted.",
      async options() {
        return this.getCollections();
      },
    },
    document: {
      label: "Document",
      type: "string",
      description: "The document ID",
    },
  },
  methods: {
    async connect() {
      const {
        username,
        password,
        database,
        hostname,
      } = this.$auth;
      const uri = `mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`;
      await mongoose.connect(uri);
    },
    async createDocument(data, collection, parseNumbers, parseBooleans, parseDates) {
      await this.connect();
      const Model = mongoose.model(collection, this.getSchemaByData(data));
      const document = new Model(this.parseStrings(
        data,
        parseNumbers,
        parseBooleans,
        parseDates,
      ));
      try {
        await document.save();
        return document;
      } finally {
        mongoose.connection.close();
      }
    },
    async updateDocument(collection, _id, data, parseNumbers, parseBooleans, parseDates) {
      try {
        await this.connect();
        const Model = mongoose.model(collection, this.getSchemaByData(data));
        const document = await Model.findByIdAndUpdate(_id, this.parseStrings(
          data,
          parseNumbers,
          parseBooleans,
          parseDates,
        ));
        return document;
      } finally {
        mongoose.connection.close();
      }
    },
    async deleteDocumentById(collection, _id) {
      try {
        await this.connect();
        const schema = new mongoose.Schema(undefined, {
          strict: false,
        });
        const Model = mongoose.model(collection, schema);
        await Model.deleteOne({
          _id,
        });
      } finally {
        mongoose.connection.close();
      }
    },
    getCollections() {
      return new Promise((resolve, reject) => {
        this.connect()
          .then(async () => {
            try {
              const collections = await mongoose.connection.db.listCollections().toArray();
              resolve(collections.map((collection) => collection.name).sort());
            } catch (err) {
              reject(err);
            } finally {
              mongoose.connection.close();
            }
          })
          .catch((err) => reject(err));
      });
    },
    getDocumentsId(collection, limit, skip) {
      return new Promise((resolve, reject) => {
        this.connect()
          .then(async () => {
            try {
              const schema = new mongoose.Schema(undefined, {
                strict: false,
              });
              const Model = mongoose.model(collection, schema);
              const documents = await Model.find(
                undefined,
                undefined,
                {
                  limit,
                  skip,
                },
              );
              resolve(documents.map((doc) => doc._id));
            } catch (err) {
              reject(err);
            } finally {
              mongoose.connection.close();
            }
          })
          .catch((err) => reject(err));
      });
    },
    getSchemaByData(data) {
      const keys = Object.keys(data);
      const schemaFields = {};
      for (let i = 0; i < keys.length; i++) {
        schemaFields[keys[i]] = {
          type: mongoose.Schema.Types.Mixed,
        };
      }

      const schema = new mongoose.Schema(schemaFields, {
        strict: false,
      });

      return schema;
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
  },
};
