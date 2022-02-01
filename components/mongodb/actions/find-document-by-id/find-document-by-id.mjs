import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-find-document-by-id",
  name: "Find Document by Id",
  description: "Retrieves a single document by ID. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.1",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
      description: "Collection containing the document to find.",
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
  },
  async run({ $ }) {
    const document = await this.mongodbApp.findDocumentById(
      this.collection,
      this.document,
    );

    $.export("$summary", this.document
      ? `Document "${this.document}" successfully fetched`
      : "No document found");
    return document;
  },
};
