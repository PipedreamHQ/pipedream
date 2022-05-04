import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-delete-a-document",
  name: "Delete a Document",
  description: "Delete a single document by ID. [See the docs here](https://docs.mongodb.com/manual/tutorial/remove-documents/)",
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
  },
  async run({ $ }) {
    await this.mongodbApp.deleteDocumentById(
      this.collection,
      this.document,
    );
    $.export("$summary", `Document "${this.document}" successfully deleted`);
  },
};
