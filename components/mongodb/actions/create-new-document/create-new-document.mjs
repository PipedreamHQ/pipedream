import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-create-new-document",
  name: "Create New Document",
  description: "Create a new document in a collection of your choice. [See the docs here](https://docs.mongodb.com/manual/tutorial/insert-documents/)",
  version: "0.1.6",
  annotations: {
    destructiveHint: false,
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
    data: {
      label: "Data",
      type: "object",
      description: "The object to be used in document creation. Values will be interpreted as strings. To pass a number, boolean, array, or object, wrap the value in an expression. eg. `{{1}}`",
    },
  },
  async run({ $ }) {
    const document = await this.mongodbApp.createDocument(
      this.data,
      this.database,
      this.collection,
    );
    $.export("$summary", `Document "${document.insertedId}" successfully created`);
    return document;
  },
};
