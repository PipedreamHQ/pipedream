import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-read-from-collection",
  name: "Read From Fauna Collection",
  description: "Reads all documents from a given Fauna collection. [See docs here](https://docs.fauna.com/fauna/current/api/fql/functions/documents)",
  version: "0.4.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
