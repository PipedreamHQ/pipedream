import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-image",
  name: "Replace Image",
  description: "Replace image in a existing document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
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
    imageId: {
      propDefinition: [
        googleDocs,
        "imageId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
      description: "The image that will be replaced",
    },
    imageUri: {
      propDefinition: [
        googleDocs,
        "imageUri",
      ],
    },
  },
  async run({ $ }) {
    const image = {
      imageObjectId: this.imageId,
      uri: this.imageUri,
    };
    await this.googleDocs.replaceImage(this.docId, image);
    const doc = this.googleDocs.getDocument(this.docId);
    $.export("$summary", `Successfully replaced image in doc with ID: ${this.docId}`);
    return doc;
  },
};
