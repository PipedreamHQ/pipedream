import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-search-documents",
  name: "Search Documents",
  description: "Search for specific documents or return all documents. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.3",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
    },
    filter: {
      label: "Filter",
      description: "Object to use as a filter. The filter value(s) may be string, number, boolean, date, or valid JSON object.",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedFilter = this.mongodbApp.parseFilter(this.filter);
    const documents = await this.mongodbApp.searchDocuments(
      this.collection,
      parsedFilter,
    );

    $.export("$summary", "Documents successfully fetched");
    return documents;
  },
};
