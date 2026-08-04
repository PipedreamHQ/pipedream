import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-text",
  name: "Insert Text",
  description: "Insert text into a Google Doc at the beginning, end, or a specific character index. Use **Find Document** to resolve a document's name to its ID. To append text to the end of a doc, use `position: end` (the default). [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to insert.",
    },
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
  },
  async run({ $ }) {
    const request = this.googleDocs._buildRequestForPosition({
      text: this.text,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertText", request);
    $.export("$summary", `Inserted text into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
