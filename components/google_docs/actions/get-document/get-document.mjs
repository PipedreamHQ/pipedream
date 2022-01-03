import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the contents of the latest version of a document.",
  version: "0.0.3",
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
  },
  async run() {
    const docs = this.googleDocs.docs();
    return (await docs.documents.get({
      documentId: this.docId,
    })).data;
  },
};
