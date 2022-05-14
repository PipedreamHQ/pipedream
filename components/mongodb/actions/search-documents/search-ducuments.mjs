import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-search-documents",
  name: "Search Documents",
  description: "Search for specific documents or return all documents. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.2",
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
      description: "Object to use as a filter",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const documents = await this.mongodbApp.searchDocuments(
      this.collection,
      this.filter,
    );

    $.export("$summary", "Documents successfully fetched");
    return documents;
  },
};
