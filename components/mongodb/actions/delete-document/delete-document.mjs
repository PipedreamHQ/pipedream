import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-delete-document",
  name: "Delete a Document",
  description: "Delete a single document by ID. [See the docs here](https://docs.mongodb.com/manual/tutorial/remove-documents/)",
  version: "0.1.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    await this.mongodbApp.deleteDocumentById(
      this.database,
      this.collection,
      this.document,
    );
    $.export("$summary", `Document "${this.document}" successfully deleted`);
  },
};
