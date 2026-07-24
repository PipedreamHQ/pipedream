import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Find and replace all occurrences of a string in a Google Doc. Use **Find Document** to resolve a document's name to its ID. Returns the number of replacements made. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    find: {
      type: "string",
      label: "Find",
      description: "The text to search for.",
    },
    replace: {
      type: "string",
      label: "Replace",
      description: "The text to replace each match with.",
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.googleDocs.replaceText(this.documentId, {
      replaceText: this.replace,
      containsText: {
        text: this.find,
        matchCase: this.matchCase,
      },
    });
    const occurrences = data?.replies?.[0]?.replaceAllText?.occurrencesChanged ?? 0;
    $.export("$summary", `Replaced ${occurrences} occurrence${occurrences === 1
      ? ""
      : "s"} of "${this.find}" in document ${this.documentId}`);
    return {
      documentId: this.documentId,
      occurrencesChanged: occurrences,
    };
  },
};
