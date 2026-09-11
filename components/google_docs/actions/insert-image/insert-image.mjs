import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-image",
  name: "Insert Image",
  description: "Insert an inline image into a Google Doc from a publicly reachable image URL. The URL must be publicly accessible (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Use **Find Document** to resolve a document's name to its ID. In a multi-tab document, set **Tab ID** to choose which tab receives the image — without it the image goes into the document's first tab; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
    },
  },
  async run({ $ }) {
    const request = this.googleDocs._buildRequestForPosition({
      uri: this.imageUri,
    }, this.position, this.tabId);
    await this.googleDocs._batchUpdate(this.documentId, "insertInlineImage", request);
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    $.export("$summary", `Inserted image into ${target}`);
    return this.googleDocs.getWriteResult(this.documentId, this.tabId);
  },
};
