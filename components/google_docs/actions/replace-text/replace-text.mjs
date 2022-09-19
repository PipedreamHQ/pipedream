import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Replace all instances of matched text in a existing document. [See the docs](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const text = {
      replaceText: this.text,
      containsText: {
        text: this.replaced,
        matchCase: this.matchCase,
      },
    };
    await this.googleDocs.replaceText(this.docId, text);
    $.export("$summary", "Successfully replaced text in doc");
    return {
      documentId: this.docId,
    };
  },
};
