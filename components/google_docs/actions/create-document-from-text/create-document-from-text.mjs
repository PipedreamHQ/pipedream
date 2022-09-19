import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-document-from-text",
  name: "Create New Document from Text",
  description: "Create a new document from plain text. [See the docs](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
  version: "0.0.2",
  type: "action",
  props: {
    googleDocs,
    title: "string",
    text: {
      propDefinition: [
        googleDocs,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const { documentId } = await this.googleDocs.createEmptyDoc(this.title);
    const text = {
      text: this.text,
    };
    await this.googleDocs.insertText(documentId, text);
    $.export("$summary", "Successfully created doc");
    return {
      documentId,
    };
  },
};
