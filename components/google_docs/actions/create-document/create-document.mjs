import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document",
  name: "Create a New Document",
  description: "Create a new document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
  version: "0.1.3",
  type: "action",
  props: {
    googleDocs,
    title: "string",
  },
  async run({ $ }) {
    const response = await this.googleDocs.createEmptyDoc(this.title);
    $.export("$summary", `Successfully created document with ID: ${response.documentId}`);
    return response;
  },
};
