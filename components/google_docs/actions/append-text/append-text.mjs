import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-append-text",
  name: "Append Text",
  description: "Append text to an existing document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    text: {
      propDefinition: [
        googleDocs,
        "text",
      ],
    },
    appendAtBeginning: {
      propDefinition: [
        googleDocs,
        "appendAtBeginning",
      ],
    },
  },
  async run({ $ }) {
    await this.googleDocs.insertText(this.docId, {
      text: this.text,
    }, this.appendAtBeginning);
    const doc = this.googleDocs.getDocument(this.docId);
    $.export("$summary", `Successfully appended text to document with ID: ${this.docId}`);
    return doc;
  },
};
