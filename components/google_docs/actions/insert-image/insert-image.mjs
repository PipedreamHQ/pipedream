import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-insert-image",
  name: "Insert Image",
  description: "Insert an inline image into a Google Doc from a publicly reachable image URL. The URL must be publicly accessible (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Use **Find Document** to resolve a document's name to its ID. Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "Optional Google Docs API field mask limiting which document fields are returned, e.g. `documentId,title,revisionId` to confirm the write without pulling the whole document back. Only top-level fields of the Docs document resource are valid: `documentId`, `title`, `revisionId`, `body`, `documentStyle`, `namedStyles`, `inlineObjects`, `lists`, `namedRanges`, `tabs`. There is no `url` field, and an unknown field name fails the call. Nested selections are allowed, e.g. `body/content` or `tabs(documentTab(body))`. Leave blank to return the full document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Document)",
      optional: true,
    },
  },
  async run({ $ }) {
    utils.validateFieldMask(this.fields);

    const request = this.googleDocs._buildRequestForPosition({
      uri: this.imageUri,
    }, this.position);
    await this.googleDocs._batchUpdate(this.documentId, "insertInlineImage", request);
    $.export("$summary", `Inserted image into document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId, false, this.fields);
  },
};
