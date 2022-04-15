// import faunadb from "faunadb";
import faunadb from "../../faunadb.app.mjs";

export default {
  key: "faunadb-read-from-collection",
  name: "Read From FaunaDB Collection",
  description: "Reads all documents from given FaunaDB collection",
  version: "0.4.2",
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
      label: "Documents Field",
      description: "The field will be returned by query",
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

    $.export("summary", "Successfully retrieved collections documents");

    return response;
  },
};
