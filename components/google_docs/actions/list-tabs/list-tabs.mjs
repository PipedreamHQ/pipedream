import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-list-tabs",
  name: "List Tabs",
  description: "List the tabs in a Google Doc — each tab's ID, title, position and nesting. A Google Doc can hold many tabs, and an omitted **Tab ID** means different things per operation: content writes (**Insert Text**, **Insert Table**, **Insert Image**, **Insert Page Break**, **Write Table**, **Delete Table**) go to the **first** tab; **Replace Text** replaces in **every** tab; the styling tools (**Format Text**, **Format Paragraph**, **Format Table Cell**, **Apply Bullets**, **Remove Bullets**) cover every tab when the target is located by Find Text, but only the first tab when given explicit indices. So call this first whenever the job names a tab (\"add this to the Budget tab\") or the document might have more than one. Returns `{documentId, tabCount, tabs: [{tabId, title, index, nestingLevel, parentTabId}]}`, in document order, with each parent followed by its nested child tabs. Pass a `tabId` from this list to **Get Document** to read one tab, or to **Insert Text**, **Write Table**, **Insert Image**, **Insert Table**, **Insert Page Break**, **Delete Table** or **Replace Text** to edit one. Use **Find Document** to resolve a document's name to its ID. This tool set can list tabs, add a tab (**Create Tab**) and read or write a named tab; it cannot rename, reorder or delete an existing tab — say so plainly rather than attempting a workaround. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get#query-parameters)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const tabs = await this.googleDocs.listTabs(this.documentId);
    $.export("$summary", `Found ${tabs.length} tab${tabs.length === 1
      ? ""
      : "s"} in document ${this.documentId}`);
    return {
      documentId: this.documentId,
      tabCount: tabs.length,
      tabs,
    };
  },
};
