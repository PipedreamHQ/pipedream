import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-search-documents",
  name: "Search Documents",
  description: "Search for specific documents or return all documents. [See the docs here](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.1",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
      description: "Collection containing the document to search for.",
    },
    filter: {
      label: "Filter",
      description: "Object to use as a filter",
      type: "object",
      optional: true,
    },
    parseNumbers: {
      propDefinition: [
        mongodbApp,
        "parseNumbers",
      ],
      description: "If `true`, each number value represented by a string in the filter will be parsed to it respective type",
      optional: true,
    },
    parseBooleans: {
      propDefinition: [
        mongodbApp,
        "parseBooleans",
      ],
      description: "If `true`, each boolean value represented by a string in the filter will be parsed to it respective type",
      optional: true,
    },
    parseDates: {
      propDefinition: [
        mongodbApp,
        "parseDates",
      ],
      description: "If `true`, each date value represented by a string in the filter will be parsed to it respective type",
      optional: true,
    },
  },
  async run({ $ }) {
    const documents = await this.mongodbApp.searchDocuments(
      this.collection,
      this.filter,
      undefined,
      undefined,
      this.parseNumbers,
      this.parseBooleans,
      this.parseDates,
    );

    $.export("$summary", "Documents successfully fetched");
    return documents;
  },
};
