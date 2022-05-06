import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-update-a-document",
  name: "Update a Document",
  description: "Updates a single document by ID. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/)",
  version: "0.1.0",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
    },
    document: {
      propDefinition: [
        mongodbApp,
        "document",
      ],
    },
    data: {
      label: "Data",
      type: "object",
      description: "The object to be used in document update",
    },
    parseNumbers: {
      label: "Parse Numbers",
      type: "boolean",
      description: "If `true`. All number values represented by a string will be parsed to it respective type",
      default: true,
    },
    parseBooleans: {
      label: "Parse Booleans",
      type: "boolean",
      description: "If `true`. All boolean values represented by a string will be parsed to it respective type",
      default: true,
    },
    parseDates: {
      label: "Parse Dates",
      type: "boolean",
      description: "If `true`. All date values represented by a string will be parsed to it respective type",
      default: true,
    },
  },
  async run({ $ }) {
    await this.mongodbApp.updateDocument(
      this.collection,
      this.document,
      this.data,
      this.parseNumbers,
      this.parseBooleans,
      this.parseDates,
    );
    $.export("$summary", `Document "${this.document}" successfully updated`);
  },
};
