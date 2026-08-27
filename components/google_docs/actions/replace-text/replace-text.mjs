import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Find and replace all occurrences of a string in a Google Doc. Set **Replacement Format** to `markdown` to convert Markdown in the replacement into native Google Docs formatting. Use **Find Document** to resolve a document's name to its ID. Returns the number of replacements made. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
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
      description: "The text to replace each match with.",
    },
    format: {
      propDefinition: [
        googleDocs,
        "replacementFormat",
      ],
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      find,
      replace,
      format,
      matchCase,
    } = this;

    if (format === "markdown") {
      const {
        occurrencesChanged, formattingRequestsApplied,
      } = await googleDocs.replaceTextWithMarkdown({
        documentId,
        textToReplace: find,
        markdownReplacement: replace,
        matchCase,
      });
      $.export("$summary", `Replaced ${occurrencesChanged} occurrence${occurrencesChanged === 1
        ? ""
        : "s"} of "${find}" in document ${documentId}, applying ${formattingRequestsApplied} formatting request${formattingRequestsApplied === 1
        ? ""
        : "s"}`);
      return {
        documentId,
        occurrencesChanged,
        formattingRequestsApplied,
      };
    }

    const { data } = await googleDocs.replaceText(documentId, {
      replaceText: replace,
      containsText: {
        text: find,
        matchCase,
      },
    });
    const occurrences = data?.replies?.[0]?.replaceAllText?.occurrencesChanged ?? 0;
    $.export("$summary", `Replaced ${occurrences} occurrence${occurrences === 1
      ? ""
      : "s"} of "${find}" in document ${documentId}`);
    return {
      documentId,
      occurrencesChanged: occurrences,
    };
  },
};
