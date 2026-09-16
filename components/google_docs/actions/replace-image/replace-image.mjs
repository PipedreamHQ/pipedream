import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";
import { DOCUMENT_FIELDS } from "../../common/constants.mjs";

export default {
  key: "google_docs-replace-image",
  name: "Replace Image",
  description: "Replace an existing inline image in a Google Doc with a different image, keeping its position and size. The replacement URL must be publicly reachable (Google fetches it server-side) and point to a PNG, JPEG, or GIF. Use **Find Document** to resolve a document's name to its ID, then **Get Document** to list the document's images - each key of the response's `inlineObjects` map is an **Image ID**. Use **Insert Image** instead to add a new image rather than swap one out. Works on multi-tab documents: pass a **Tab ID**, or leave it blank and the tab holding the image is found automatically. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest)",
  version: "0.2.0",
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
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: `Optional Google Docs API field mask limiting which document fields are returned, e.g. \`documentId,title,revisionId\` to confirm the write without pulling the whole document back. Valid top-level fields: ${DOCUMENT_FIELDS.map((field) => `\`${field}\``).join(", ")}. Nested selections are allowed, e.g. \`body/content\`. There is no \`url\` field, and an invalid mask fails the call before the document is changed. Cannot be combined with **Tab ID**. Leave blank to return the full document.`,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.tabId && this.fields) {
      throw new ConfigurationError("Tab ID cannot be combined with a Fields mask: a mask selects top-level document fields, while a tab response is assembled separately. Remove the Fields mask or omit the Tab ID.");
    }
    await utils.validateFieldMask(this.googleDocs, this.docId, this.fields);

    // `ReplaceImageRequest.tabId` is what makes this work past the first tab.
    // Omitted, the API looks in the first tab only and a caller who picked an
    // image from another tab gets "object not found", so resolve it from the
    // image itself — the object id doesn't reveal its tab.
    const tabId = this.tabId
      ?? await this.googleDocs.findImageTabId(this.docId, this.imageId);

    const image = {
      imageObjectId: this.imageId,
      uri: this.imageUri,
      ...(tabId && {
        tabId,
      }),
    };
    await this.googleDocs.replaceImage(this.docId, image);
    // Was missing its `await`, so this returned an unresolved promise. Reading
    // back through `getDocumentWithTabs` keeps `body`/`textContent` where they
    // have always been and adds every tab's text alongside, so a replacement in
    // a second tab is visible instead of looking like nothing happened.
    const doc = this.fields
      ? await this.googleDocs.getDocument(this.docId, false, this.fields)
      : await this.googleDocs.getDocumentWithTabs(this.docId);
    $.export(
      "$summary",
      `Successfully replaced image in doc with ID: ${this.docId}`
      + (tabId
        ? ` (tab ${tabId})`
        : ""),
    );
    return doc;
  },
};
