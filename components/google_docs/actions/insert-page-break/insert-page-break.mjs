import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-page-break",
  name: "Insert Page Break",
  description: "Insert a page break into a Google Doc at the beginning, end, or a specific character index. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertPageBreakRequest)",
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
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
  },
  async run({ $ }) {
    const request = this.googleDocs._buildRequestForPosition({}, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertPageBreak", request);
    $.export("$summary", `Inserted page break into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
