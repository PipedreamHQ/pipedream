import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the full text content and structure of a Google Doc by its ID. Returns the document body plus a flattened `textContent` field for easy reading. A Google Doc can hold several tabs: `body`/`textContent` are always the **first** tab's content, and every tab is listed in `tabs` (with each tab's own `textContent` when the document has more than one), so a single call shows all of the document's text. Pass a **Tab ID** from that list to get one tab's full structure on its own. Optionally supply a `fields` mask to request a partial (e.g. metadata-only) response and skip the body-text enrichment. Use **Find Document** first to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "1.2.0",
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
      type: "string",
      label: "Fields",
      description: "Optional Google Docs API field mask (partial response) that limits which top-level document fields are returned, e.g. `title,documentId,revisionId` for metadata only. When set, only the requested fields are returned and the `textContent` enrichment is skipped, so a body-less response will not error. Cannot be combined with **Tab ID**. Leave blank to return the full document with `textContent`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get#query-parameters)",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.tabId && this.fields) {
      throw new ConfigurationError("Tab ID cannot be combined with a Fields mask, because the mask may exclude the tab data required for filtering. Remove the Fields mask or omit the Tab ID.");
    }

    if (this.tabId) {
      const response = await this.googleDocs.getDocument(this.documentId, true);
      // Nested child tabs are searched too, and the error names the tabs that
      // do exist — the old message pointed callers at a tab-less response.
      const tab = this.googleDocs._findTab(response, this.tabId);
      $.export("$summary", `Retrieved tab "${this.tabId}" from document ${this.documentId}`);
      return {
        ...tab,
        textContent: utils.getTextContentFromDocument(tab.documentTab?.body?.content ?? []),
        documentId: response.documentId,
        title: response.title,
        revisionId: response.revisionId,
      };
    }

    if (this.fields) {
      const response = await this.googleDocs.getDocument(this.documentId, false, this.fields);
      $.export("$summary", `Retrieved document ${this.documentId}`);
      return response;
    }

    const response = await this.googleDocs.getDocumentWithTabs(this.documentId);
    $.export("$summary", `Retrieved document ${this.documentId}${response.tabCount > 1
      ? ` (${response.tabCount} tabs)`
      : ""}`);
    return response;
  },
};
