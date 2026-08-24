import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Find and replace all occurrences of a string in a Google Doc. The replacement can be written in Markdown. Use **Find Document** to resolve a document's name to its ID. Returns the number of replacements made. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "1.1.0",
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
      description: "The text to replace each match with. Markdown syntax in this value is converted to Google Docs formatting when **Parse as Markdown** is enabled.",
    },
    enableMarkdown: {
      type: "boolean",
      label: "Parse as Markdown",
      description: "Convert Markdown in the replacement to Google Docs formatting, so `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, headings and lists render as formatted text rather than literal characters. Defaults to `false`, which inserts the replacement exactly as written.",
      default: false,
      optional: true,
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
  },
  async run({ $ }) {
    const { data } = this.enableMarkdown
      ? await this.googleDocs.replaceTextWithMarkdown({
        documentId: this.documentId,
        textToReplace: this.find,
        markdownReplacement: this.replace,
        matchCase: this.matchCase,
      })
      : await this.googleDocs.replaceText(this.documentId, {
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
