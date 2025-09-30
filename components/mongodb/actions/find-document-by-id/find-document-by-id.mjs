import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-find-document-by-id",
  name: "Find Document by Id",
  description: "Retrieves a single document by ID. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    document: {
      propDefinition: [
        mongodbApp,
        "document",
        (c) => ({
          database: c.database,
          collection: c.collection,
        }),
      ],
    },
  },
  async run({ $ }) {
    const document = await this.mongodbApp.findDocumentById(
      this.database,
      this.collection,
      this.document,
    );

    $.export("$summary", this.document
      ? `Document "${this.document}" successfully fetched`
      : "No document found");
    return document;
  },
};
