import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-insert-text",
  name: "Insert Text",
  description: "Insert text into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#inserttextrequest)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    docId: {
      propDefinition: [
        googleDocs,
        "docId",
      ],
    },
    text: {
      propDefinition: [
        googleDocs,
        "text",
      ],
    },
    index: {
      type: "integer",
      label: "Index",
      description: "The index to insert the text at",
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
    const text = {
      text: this.text,
      location: {
        index: this.index,
        tabId: this.tabId,
      },
    };
    await this.googleDocs._batchUpdate(this.docId, "insertText", text);
    $.export("$summary", "Successfully inserted text");
    return this.googleDocs.getDocument(this.docId, !!this.tabId);
  },
};
