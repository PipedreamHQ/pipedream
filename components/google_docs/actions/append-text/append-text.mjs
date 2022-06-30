import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-append-text",
  name: "Append Text",
  description: "Append text to an existing document. [See the docs](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
  version: "0.1.1",
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
    const text = {
      text: this.text,
    };
    await this.googleDocs.insertText(this.docId, text, this.appendAtBeginning);
    $.export("$summary", "Successfully appended text to doc");
    return {
      documentId: this.docId,
    };
  },
};
