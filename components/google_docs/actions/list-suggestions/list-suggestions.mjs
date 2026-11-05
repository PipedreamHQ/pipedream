import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-list-suggestions",
  name: "List Suggestions",
  description: "List the open suggestions (tracked changes made in Suggesting mode) in a Google Doc, with each suggestion's ID, what it changes, and where. Use this to review proposed edits, or to get the IDs **Resolve Suggestions** needs to accept or reject them. Use **Find Document** to resolve a document's name to its ID. Returns `{documentId, suggestionCount, suggestions: [{suggestionId, tabId, startIndex, endIndex, types, insertedText, deletedText}]}` in document order. `types` names what the suggestion changes (e.g. `insertion`, `deletion`, `textStyle`, `paragraphStyle`, `bullet`, `tableCellStyle`). `insertedText` / `deletedText` are lists with one entry per place the suggestion adds or removes text, and appear only when it does. `startIndex` / `endIndex` span everything the suggestion touches. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get)",
  version: "0.0.1",
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
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
      description: "For a multi-tab document, list only the suggestions in this tab (e.g. `t.0`). Get tab IDs from **List Tabs**. Omit to list suggestions in every tab.",
    },
  },
  async run({ $ }) {
    const suggestions = await this.googleDocs.listSuggestions(this.documentId, this.tabId);
    $.export("$summary", `Found ${suggestions.length} suggestion${suggestions.length === 1
      ? ""
      : "s"} in ${this.tabId
      ? `tab ${this.tabId} of `
      : ""}document ${this.documentId}`);
    return {
      documentId: this.documentId,
      suggestionCount: suggestions.length,
      suggestions,
    };
  },
};
