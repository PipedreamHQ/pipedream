import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-search-documents",
  name: "Search Documents",
  description: "Search for specific documents or return all documents. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.4",
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
      description: "Object to use as a filter. The filter value(s) may be string, number, boolean, date, or valid JSON object.",
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
    const parsedFilter = this.mongodbApp.parseFilter(this.filter);
    const documents = await this.mongodbApp.searchDocuments(
      this.database,
      this.collection,
      parsedFilter,
      this.options,
    );

    $.export("$summary", `Successfully retrieved ${documents.length} document(s)`);
    return documents;
  },
};
