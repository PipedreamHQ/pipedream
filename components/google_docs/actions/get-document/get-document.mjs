import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the contents of the latest version of a document.",
  version: "0.1.0",
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
    return this.googleDocs.getDocument(this.docId);
  },
};
