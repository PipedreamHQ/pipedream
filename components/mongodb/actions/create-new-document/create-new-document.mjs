import mongodbApp from "../../mongodb.app.mjs";

export default {
  key: "mongodb-create-new-document",
  name: "Create New Document",
  description: "Create a new document in a collection of your choice. [See the docs here](https://docs.mongodb.com/manual/tutorial/insert-documents/)",
  version: "0.0.1",
  type: "action",
  props: {
    mongodbApp,
    collection: {
      propDefinition: [
        mongodbApp,
        "collection",
      ],
    },
    data: {
      propDefinition: [
        mongodbApp,
        "data",
      ],
    },
    parseNumbers: {
      propDefinition: [
        mongodbApp,
        "parseNumbers",
      ],
    },
    parseBooleans: {
      propDefinition: [
        mongodbApp,
        "parseBooleans",
      ],
    },
    parseDates: {
      propDefinition: [
        mongodbApp,
        "parseDates",
      ],
    },
  },
  async run({ $ }) {
    const document = await this.mongodbApp.createDocument(
      this.data,
      this.collection,
      this.parseNumbers,
      this.parseBooleans,
      this.parseDates,
    );
    $.export("$summary", `Document ${document._id} successfully created`);
    return document;
  },
};
