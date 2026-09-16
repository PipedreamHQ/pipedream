import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-image",
  name: "Replace Image",
  description: "Replace image in a existing document. Works on multi-tab documents: pass a **Tab ID**, or leave it blank and the tab holding the image is found automatically. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest)",
  version: "0.1.0",
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
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
    },
  },
  async run({ $ }) {
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
    const doc = await this.googleDocs.getDocumentWithTabs(this.docId);
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
