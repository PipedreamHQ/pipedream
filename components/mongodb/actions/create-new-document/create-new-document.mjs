import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-create-new-document",
  name: "Create New Document",
  description: "Create a new document in a collection of your choice. [See the docs here](https://docs.mongodb.com/manual/tutorial/insert-documents/)",
  version: "0.1.1",
  type: "action",
  props: {
    mongodbApp,
    database: {
      propDefinition: [
        mongodbApp,
        "database",
      ],
    },
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
        (c) => ({
          database: c.database,
        }),
      ],
    },
    data: {
      label: "Data",
      type: "object",
      description: "The object to be used in document creation",
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
    const document = await this.mongodbApp.createDocument(
      this.data,
      this.database,
      this.collection,
      this.parseNumbers,
      this.parseBooleans,
      this.parseDates,
    );
    $.export("$summary", `Document "${document.insertedId}" successfully created`);
    return document;
  },
};
