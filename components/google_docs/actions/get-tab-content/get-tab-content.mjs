import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-get-tab-content",
  name: "Get Tab Content",
  description: "Get the content of a tab in a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "0.0.1",
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    tabIds: {
      type: "string[]",
      label: "Tab IDs",
      description: "Return content for the specified tabs",
      async options() {
        const { tabs } = await this.googleDocs.getDocument(this.docId, true);
        if (!tabs?.length) return [];
        return tabs.map((tab) => ({
          label: tab.tabProperties.title,
          value: tab.tabProperties.tabId,
        }));
      },
    },
  },
  async run({ $ }) {
    const response = await this.googleDocs.getDocument(this.docId, true);
    const tabs = response.tabs.filter((tab) => this.tabIds.includes(tab.tabProperties.tabId));
    $.export("$summary", `Successfully retrieved tab content for document with ID: ${this.docId}`);
    return tabs;
  },
};
