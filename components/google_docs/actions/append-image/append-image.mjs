import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-append-image",
  name: "Append Image to Document",
  description: "Appends an image to the end of a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
  version: "0.0.4",
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
    const image = {
      uri: this.imageUri,
    };
    const { data } = await this.googleDocs.appendImage(this.docId, image, this.appendAtBeginning);
    $.export("$summary", `Successfully appended image to document with ID: ${this.docId}`);
    return {
      documentId: data.documentId,
    };
  },
};
