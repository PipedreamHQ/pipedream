import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-append-image",
  name: "Append Image to Document",
  description: "Appends an image to the end of a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
  version: "0.0.11",
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
    imageUri: {
      propDefinition: [
        googleDocs,
        "imageUri",
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
    await this.googleDocs.appendImage(this.docId, {
      uri: this.imageUri,
    }, this.appendAtBeginning);
    const doc = this.googleDocs.getDocument(this.docId);
    $.export("$summary", `Successfully appended image to document with ID: ${this.docId}`);
    return doc;
  },
};
