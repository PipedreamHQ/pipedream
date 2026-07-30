import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-image",
  name: "Insert Image",
  description: "Insert an inline image into a Google Doc from a publicly reachable image URL. The URL must be publicly accessible (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
  version: "0.0.2",
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
    imageUri: {
      type: "string",
      label: "Image URL",
      description: "A publicly reachable URL of the image to insert (PNG, JPEG, or GIF). Example: `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`.",
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
      uri: this.imageUri,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertInlineImage", request);
    $.export("$summary", `Inserted image into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
