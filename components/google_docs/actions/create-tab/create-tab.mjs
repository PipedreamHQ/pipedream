import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-create-tab",
  name: "Create Tab",
  description: "Add a new tab to an existing Google Doc and return its Tab ID. The tab is created empty; pass the returned `tabId` as **Tab ID** to **Insert Text**, **Write Table**, **Insert Image**, **Insert Table** or **Insert Page Break** to fill it, because an edit sent without a Tab ID always goes to the document's first tab. Added at the end of the document's tabs unless **Position** is set, and nested under another tab when **Parent Tab ID** is set. Use **List Tabs** to see the tabs a document already has, or **Find Document** to resolve a document's name to its ID. **Position** applies only to the tab being created: this tool set cannot rename, reorder or delete a tab that already exists — say so plainly rather than attempting a workaround such as recreating the tab. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#AddDocumentTabRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the new tab, as it will appear in the document's tab list (e.g. `Q3 Budget`).",
    },
    index: {
      type: "integer",
      label: "Position",
      description: "Optional zero-based position for the new tab among its siblings — `0` makes it the document's first tab. Every tab at or after this position shifts down by one. Omit to add the tab after the existing ones.",
      min: 0,
      optional: true,
    },
    parentTabId: {
      type: "string",
      label: "Parent Tab ID",
      description: "Optional. To nest the new tab as a sub-tab, the ID of the tab to nest it under (e.g. `t.0`), from **List Tabs**. Omit for a top-level tab.",
      optional: true,
    },
  },
  async run({ $ }) {
    const tabProperties = await this.googleDocs.addTab(this.documentId, {
      title: this.title,
      index: this.index,
      parentTabId: this.parentTabId,
    });

    if (!tabProperties?.tabId) {
      throw new Error(`Google Docs did not return the new tab's ID for document ${this.documentId}. Call List Tabs to confirm whether the tab was created.`);
    }

    $.export("$summary", `Created tab "${tabProperties.title ?? this.title}" (${tabProperties.tabId}) in document ${this.documentId}`);
    return {
      documentId: this.documentId,
      ...tabProperties,
    };
  },
};
