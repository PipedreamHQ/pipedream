import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the full text content and structure of a Google Doc by its ID. Returns the document body plus a flattened `textContent` field for easy reading. A Google Doc can hold several tabs: `body`/`textContent` are always the **first** tab's content, and every tab is listed in `tabs` (with each tab's own `textContent` when the document has more than one), so a single call shows all of the document's text. Pass a **Tab ID** from that list to get one tab's full structure on its own. Optionally supply a `fields` mask to request a partial (e.g. metadata-only) response and skip the body-text enrichment. Use **Find Document** first to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "1.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    tabId: {
      type: "string",
      label: "Tab ID",
      description: "Optional. For a multi-tab document, the ID of a single tab to return in full (e.g. `t.0`). Get tab IDs from **List Tabs**, or from the `tabs` list this tool returns when called without one. Omit to return the document with its first tab's content and a summary of every tab.",
      optional: true,
    },
    fields: {
      propDefinition: [
        googleDocs,
        "fields",
      ],
      description: "Optional Google Docs API field mask (partial response) that limits which top-level document fields are returned, e.g. `title,documentId,revisionId` for metadata only. When set, only the requested fields are returned and the `textContent` enrichment is skipped, so a body-less response will not error. With a **Tab ID**, the mask is read against the document with its tabs and `tabs` is narrowed to that tab (e.g. `tabs`, or `tabs(tabProperties,documentTab/body)` — keep `tabProperties` in a nested mask so the tab can be matched). Leave blank to return the full document with `textContent`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get#query-parameters)",
    },
  },
  async run({ $ }) {
    // With both, the mask is read against the document with its tabs and
    // `tabs` is narrowed to the named one, as on the write tools, so
    // `documentId,revisionId` stays small however large the tab is. Without a
    // mask, Tab ID returns that tab in full.
    if (this.fields) {
      const response = this.googleDocs.narrowToTab(
        await this.googleDocs.getDocument(this.documentId, Boolean(this.tabId), this.fields),
        this.tabId,
      );
      $.export("$summary", `Retrieved document ${this.documentId}`);
      return response;
    }

    if (this.tabId) {
      // Nested child tabs are searched too, and the error names the tabs that
      // do exist — the old message pointed callers at a tab-less response.
      const tab = await this.googleDocs.getTab(this.documentId, this.tabId);
      $.export("$summary", `Retrieved tab "${this.tabId}" from document ${this.documentId}`);
      return tab;
    }

    const response = await this.googleDocs.getDocumentWithTabs(this.documentId);
    $.export("$summary", `Retrieved document ${this.documentId}${response.tabCount > 1
      ? ` (${response.tabCount} tabs)`
      : ""}`);
    return response;
  },
};
