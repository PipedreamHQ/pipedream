import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-page-break",
  name: "Insert Page Break",
  description: "Insert a page break into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#insertpagebreakrequest)",
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
    index: {
      type: "integer",
      label: "Index",
      description: "The index to insert the page break at",
      default: 1,
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
        (c) => ({
          documentId: c.docId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const pageBreak = {
      location: {
        index: this.index,
        tabId: this.tabId,
      },
    };
    await this.googleDocs.insertPageBreak(this.docId, pageBreak);
    $.export("$summary", "Successfully inserted page break");
    return this.googleDocs.getDocument(this.docId, !!this.tabId);
  },
};
