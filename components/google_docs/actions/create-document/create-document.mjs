import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document",
  name: "Create a New Document",
  description: "Create a new, empty document. To add content after creating the document, pass the document ID exported by this step to the Append Text action. [See the docs](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
  version: "0.1.1",
  type: "action",
  props: {
    googleDocs,
    title: "string",
  },
  async run({ $ }) {
    const createdDoc = await this.googleDocs.createEmptyDoc(this.title);
    $.export("$summary", "Successfully created doc");
    return createdDoc;
  },
};
