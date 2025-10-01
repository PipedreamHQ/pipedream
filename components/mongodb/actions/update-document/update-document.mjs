import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-update-document",
  name: "Update a Document",
  description: "Updates a single document by ID. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/)",
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
    data: {
      label: "Data",
      type: "object",
      description: "The object to be used in document update. Values will be interpreted as strings. To pass a number, boolean, array, or object, wrap the value in an expression. eg. `{{1}}`",
    },
  },
  async run({ $ }) {
    await this.mongodbApp.updateDocument(
      this.database,
      this.collection,
      this.document,
      this.data,
    );
    $.export("$summary", `Document "${this.document}" successfully updated`);
  },
};
