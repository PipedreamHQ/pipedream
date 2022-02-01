import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-update-a-document",
  name: "Update a Document",
  description: "Updates a single document by ID. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/)",
  version: "0.0.1",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
      description: "Collection containing the document to be updated.",
    },
    document: {
      propDefinition: [
        mongodbApp,
        "document",
        ({ collection }) => ({
          collection,
        }),
      ],
    },
    data: {
      propDefinition: [
        mongodbApp,
        "data",
      ],
      description: "The object to be used in document update",
    },
    parseNumbers: {
      propDefinition: [
        mongodbApp,
        "parseNumbers",
      ],
    },
    parseBooleans: {
      propDefinition: [
        mongodbApp,
        "parseBooleans",
      ],
    },
    parseDates: {
      propDefinition: [
        mongodbApp,
        "parseDates",
      ],
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
