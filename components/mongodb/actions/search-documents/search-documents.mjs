import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-search-documents",
  name: "Search Documents",
  description: "Search for specific documents or return all documents. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.9",
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
    filter: {
      label: "Filter",
      description: "Object to use as a filter. Values will be interpreted as strings. To pass a number, boolean, array, or object, wrap the value in an expression. eg. `{{1}}`",
      type: "object",
      optional: true,
    },
    options: {
      label: "Options",
      description: "Additional props for sorting and ordering. [See docs](https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/)",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const documents = await this.mongodbApp.searchDocuments(
      this.database,
      this.collection,
      this.filter,
      this.options,
    );

    $.export("$summary", `Successfully retrieved ${documents.length} document(s)`);
    return documents;
  },
};
