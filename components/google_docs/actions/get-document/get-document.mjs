import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the full text content and structure of a Google Doc by its ID. Returns the document body plus a flattened `textContent` field for easy reading. Optionally supply a `fields` mask to request a partial (e.g. metadata-only) response and skip the body-text enrichment. Use **Find Document** first to resolve a document's name to its ID. For multi-tab documents, pass a `tabId` to retrieve a single tab's content. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "1.1.0",
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
      description: "Optional. For a multi-tab document, the ID of a single tab to return. Copy it from a prior **Get Document** call's `tabs[].tabProperties.tabId` (e.g. `t.0`). Omit to return the whole document.",
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
      const tab = (response.tabs || []).find((t) => t.tabProperties?.tabId === this.tabId);
      if (!tab) {
        throw new ConfigurationError(`No tab with ID "${this.tabId}" found in document ${this.documentId}. Call this tool without a Tab ID to list the document's tabs.`);
      }
      $.export("$summary", `Retrieved tab "${this.tabId}" from document ${this.documentId}`);
      return tab;
    }

    const response = await this.googleDocs.getDocument(this.documentId, false, this.fields);
    $.export("$summary", `Retrieved document ${this.documentId}`);
    return response;
  },
};
