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
      async options({
        collection,
        page,
      }) {
        const LIMIT = 100;
        const documents =  await this.searchDocuments(
          collection,
          undefined,
          page * LIMIT,
          LIMIT,
        );
        return documents.filter((doc) => doc._id).map((doc) => ({
          label: doc.name || doc.title ?
            `${doc.name || doc.title} - ObjectId(${doc._id})`
            : `ObjectId(${doc._id})`,
          value: doc._id,
        }));
      },
    },
    data: {
      label: "Data",
      type: "object",
      description: "The object to be used in document creation. Dates must follow `yyyy-mm-dd` format",
    },
    parseNumbers: {
      label: "Parse Numbers",
      type: "boolean",
      description: "If `true`, each number value represented by a string will be parsed to it respective type",
      default: true,
    },
    parseBooleans: {
      label: "Parse Booleans",
      type: "boolean",
      description: "If `true`, each boolean value represented by a string will be parsed to it respective type",
      default: true,
    },
    parseDates: {
      label: "Parse Dates",
      type: "boolean",
      description: "If `true`, each date value represented by a string will be parsed to it respective type",
      default: true,
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
    createDocument(data, collection, parseNumbers, parseBooleans, parseDates) {
      return new Promise((resolve, reject) => {
        this.connect().then(async () => {
          try {
            const Model = mongoose.model(collection, this.getSchemaByData(data));
            const document = new Model(this.parseStrings(
              data,
              parseNumbers,
              parseBooleans,
              parseDates,
            ));
            await document.save();
            mongoose.connection.close(() => {
              setTimeout(() => resolve(document));
            });
          } catch (err) {
            mongoose.connection.close(() => {
              setTimeout(() => reject(err));
            });
          }
        })
          .catch((err) => reject(err));
      });
    },
    updateDocument(collection, _id, data, parseNumbers, parseBooleans, parseDates) {
      return new Promise((resolve, reject) => {
        this.connect().then(async () => {
          try {
            const Model = mongoose.model(collection, this.getSchemaByData(data));
            await Model.findByIdAndUpdate(_id, this.parseStrings(
              data,
              parseNumbers,
              parseBooleans,
              parseDates,
            ));
            mongoose.connection.close(() => {
              setTimeout(() => resolve());
            });
          } catch (err) {
            mongoose.connection.close(() => {
              setTimeout(() => reject(err));
            });
          }
        })
          .catch((err) => reject(err));
      });
    },
    deleteDocumentById(collection, _id) {
      return new Promise((resolve, reject) => {
        this.connect()
          .then(async () => {
            try {
              const schema = new mongoose.Schema(undefined, {
                strict: false,
              });
              const Model = mongoose.model(collection, schema);
              await Model.deleteOne({
                _id,
              });
              mongoose.connection.close(() => {
                setTimeout(() => resolve());
              });
            } catch (err) {
              mongoose.connection.close(() => {
                setTimeout(() => reject(err));
              });
            }
          })
          .catch((err) => reject(err));
      });
    },
    findDocumentById(collection, _id) {
      return new Promise((resolve, reject) => {
        this.connect()
          .then(async () => {
            try {
              const schema = new mongoose.Schema(undefined, {
                strict: false,
              });
              const Model = mongoose.model(collection, schema);
              const document = await Model.findById(_id);
              mongoose.connection.close(() => {
                setTimeout(() => resolve(document));
              });
            } catch (err) {
              mongoose.connection.close(() => {
                setTimeout(() => reject(err));
              });
            }
          })
          .catch((err) => reject(err));
      });
    },
    searchDocuments(collection, filter, skip, limit, parseNumbers, parseBooleans, parseDates) {
      return new Promise((resolve, reject) => {
        this.connect()
          .then(async () => {
            try {
              const schema = new mongoose.Schema(undefined, {
                strict: false,
              });
              const Model = mongoose.models[collection] || mongoose.model(collection, schema);
              const documents = await Model.find(
                this.parseStrings(filter, parseNumbers, parseBooleans, parseDates),
              )
                .skip(skip)
                .limit(limit);
              mongoose.connection.close(() => {
                setTimeout(() => resolve(documents));
              });
            } catch (err) {
              mongoose.connection.close(() => {
                setTimeout(() => reject(err));
              });
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
    parseStrings(data, parseNumbers, parseBooleans, parseDates) {
      const obj = {};
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        if (parseBooleans && typeof(data[keys[i]]) === "string" && this.isBooleanString(data[keys[i]])) {
          obj[keys[i]] = this.parseBoolean(data[keys[i]]);
          continue;
        }

        if (parseDates && typeof(data[keys[i]]) === "string" && this.isDate(data[keys[i]])) {
          obj[keys[i]] = new Date(data[keys[i]]);
          continue;
        }

        if (parseNumbers && typeof(data[keys[i]]) === "string" && !isNaN(data[keys[i]])) {
          obj[keys[i]] = parseFloat(data[keys[i]]);
          continue;
        }

        obj[keys[i]] = data[keys[i]];
      }

      return obj;
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
      if ((typeof string) === "boolean" || !string.toLowerCase) {
        return false;
      }
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
      // Dates must start with yyyy-mm-dd
      const regex = new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/);
      if (!regex.test(str)) {
        return false;
      }

      return (new Date(str) !== "Invalid Date") && !isNaN(new Date(str));
    },
  },
};
