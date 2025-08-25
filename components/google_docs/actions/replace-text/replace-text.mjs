import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Replace all instances of matched text in an existing document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "0.0.8",
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    replaced: {
      propDefinition: [
        googleDocs,
        "text",
      ],
      label: "Text to be replaced",
      description: "The text that will be replaced",
    },
    text: {
      propDefinition: [
        googleDocs,
        "text",
      ],
      label: "New Text",
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
    tabIds: {
      propDefinition: [
        googleDocs,
        "tabId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
      type: "string[]",
      label: "Tab IDs",
      description: "The tab IDs to replace the text in",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = {
      replaceText: this.text,
      containsText: {
        text: this.replaced,
        matchCase: this.matchCase,
      },
      tabsCriteria: this.tabIds
        ? {
          tabIds: this.tabIds,
        }
        : undefined,
    };
    await this.googleDocs.replaceText(this.docId, text);
    const doc = this.googleDocs.getDocument(this.docId);
    $.export("$summary", `Successfully replaced text in doc with ID: ${this.docId}`);
    return doc;
  },
};
