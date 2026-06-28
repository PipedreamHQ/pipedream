import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the full text content and structure of a Google Doc by its ID. Returns the document body plus a flattened `textContent` field for easy reading. Use **Find Document** first to resolve a document's name to its ID. For multi-tab documents, pass a `tabId` to retrieve a single tab's content. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    tabId: {
      type: "string",
      label: "Tab ID",
      description: "Optional. For a multi-tab document, the ID of a single tab to return. Omit to return the whole document.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.tabId) {
      const response = await this.googleDocs.getDocument(this.documentId, true);
      const tabs = (response.tabs || []).filter((tab) => tab.tabProperties?.tabId === this.tabId);
      $.export("$summary", `Retrieved tab "${this.tabId}" from document ${this.documentId}`);
      return tabs;
    }

    const response = await this.googleDocs.getDocument(this.documentId);
    $.export("$summary", `Retrieved document ${this.documentId}`);
    return response;
  },
};
