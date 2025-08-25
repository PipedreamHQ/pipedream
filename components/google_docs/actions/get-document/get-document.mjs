import googleDocs from "../../google_docs.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_docs-get-document",
  name: "Get Document",
  description: "Get the contents of the latest version of a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
  version: "0.1.7",
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    includeTabsContent: {
      type: "boolean",
      label: "Include Tabs Content",
      description: "Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`",
      optional: true,
      default: false,
    },
    tabIds: {
      type: "string[]",
      label: "Tab IDs",
      description: "Only return content for the specified tabs",
      optional: true,
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
    if (this.tabIds?.length && !this.includeTabsContent) {
      throw new ConfigurationError("Include Tabs Content must be true if tabIds are provided");
    }

    const response = await this.googleDocs.getDocument(this.docId, this.includeTabsContent);

    if (this.tabIds?.length) {
      response.tabs = response.tabs.filter((tab) => this.tabIds.includes(tab.tabProperties.tabId));
    }

    $.export("$summary", `Successfully retrieved document with ID: ${this.docId}`);

    return response;
  },
};
