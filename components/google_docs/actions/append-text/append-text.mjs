import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-append-text",
  name: "Append Text",
  description: "Append text to the end of a Google Doc, or to the very beginning when **Append at Beginning** is set. Use when adding a line or paragraph to an existing document without choosing an exact character position. Use **Insert Text** instead when the text must land at a specific index, or when inserting into a particular tab. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "documentId",
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
    const doc = await this.googleDocs.getDocument(this.docId);
    $.export("$summary", `Successfully appended text to document with ID: ${this.docId}`);
    return doc;
  },
};
