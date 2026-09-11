import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-replace-image",
  name: "Replace Image",
  description: "Replace an existing inline image in a Google Doc with a different image, keeping its position and size. The replacement URL must be publicly reachable (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Use **Find Document** to resolve a document's name to its ID, then **Get Document** to list the document's images - each key of the response's `inlineObjects` map is an **Image ID**. Use **Insert Image** instead to add a new image rather than swap one out. Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
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
      description: "The ID of the inline image to replace. Call **Get Document** and pass a key from the response's `inlineObjects` map (e.g. `kix.abc123def`).",
    },
    imageUri: {
      propDefinition: [
        googleDocs,
        "imageUri",
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

    const image = {
      imageObjectId: this.imageId,
      uri: this.imageUri,
    };
    await this.googleDocs.replaceImage(this.docId, image);
    const doc = await this.googleDocs.getDocument(this.docId, false, this.fields);
    $.export("$summary", `Successfully replaced image in doc with ID: ${this.docId}`);
    return doc;
  },
};
