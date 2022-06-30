import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-read-from-collection",
  name: "Read From FaunaDB Collection",
  description: "Reads all documents from a given FaunaDB collection. [See docs here](https://docs.fauna.com/fauna/current/api/fql/functions/documents)",
  version: "0.4.3",
  type: "action",
  props: {
    faunadb,
    collectionName: {
      propDefinition: [
        faunadb,
        "collections",
      ],
    },
    documentField: {
      label: "Document Field",
      description: "The value of the document field that will be returned by query",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      collectionName,
      documentField,
    } = this;

    const response = await this.faunadb.getDocumentsInCollection({
      collectionName,
      documentField,
    });

    $.export("$summary", "Successfully retrieved the collection's documents");

    return response;
  },
};
