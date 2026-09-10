import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Find and replace all occurrences of a string in a Google Doc. Set **Replacement Format** to `markdown` to convert Markdown in the replacement into native Google Docs formatting. Use **Find Document** to resolve a document's name to its ID. Returns the number of replacements made. In a multi-tab document the replacement runs across **every** tab by default; set **Tab ID** to confine it to one tab, using **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "1.2.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    tabId: {
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
      description: "For a multi-tab document, confine the replacement to this tab (e.g. `t.0`). Get tab IDs from **List Tabs**. Omit to replace in every tab.",
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
      tabId,
    } = this;

    // `replaceAllText` with no `tabsCriteria` replaces in every tab (measured),
    // which is the right default for a find-and-replace; a Tab ID narrows it.
    const target = tabId
      ? `tab ${tabId} of document ${documentId}`
      : `document ${documentId}`;
    const tabIds = tabId
      ? [
        tabId,
      ]
      : null;

    if (format === "markdown") {
      const {
        occurrencesChanged, formattingRequestsApplied,
      } = await googleDocs.replaceTextWithMarkdown({
        documentId,
        textToReplace: find,
        markdownReplacement: replace,
        matchCase,
        tabIds,
      });
      $.export("$summary", `Replaced ${occurrencesChanged} occurrence${occurrencesChanged === 1
        ? ""
        : "s"} of "${find}" in ${target}, applying ${formattingRequestsApplied} formatting request${formattingRequestsApplied === 1
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
      ...(tabIds && {
        tabsCriteria: {
          tabIds,
        },
      }),
    });
    const occurrences = data?.replies?.[0]?.replaceAllText?.occurrencesChanged ?? 0;
    $.export("$summary", `Replaced ${occurrences} occurrence${occurrences === 1
      ? ""
      : "s"} of "${find}" in ${target}`);
    return {
      documentId,
      occurrencesChanged: occurrences,
    };
  },
};
