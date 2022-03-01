import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document",
  name: "Create a New Document",
  description: "Create a new, empty document. To add content after creating the document, pass the document ID exported by this step to the Append Text action.",
  version: "0.0.7",
  type: "action",
  props: {
    googleDocs,
    title: "string",
  },
  async run() {
    const docs = this.googleDocs.docs();
    return (await docs.documents.create({
      requestBody: {
        title: this.title,
      },
    })).data;
  },
};
