import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-replace-text",
  name: "Replace Text",
  description: "Replace all instances of matched text in an existing document. Supports Markdown formatting in the replacement text. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
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
      description: "The replacement text. Can include Markdown formatting (bold, italic, code, links, headings, lists, etc.).",
    },
    enableMarkdown: {
      type: "boolean",
      label: "Parse as Markdown",
      description: "Enable Markdown parsing for the replacement text. When enabled, Markdown syntax (e.g., **bold**, *italic*, [links](url), `code`) will be converted to Google Docs formatting.",
      default: false,
      optional: true,
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
    const {
      googleDocs,
      docId,
      replaced,
      text,
      enableMarkdown,
      matchCase,
      tabIds,
    } = this;

    if (enableMarkdown) {
      // Use Markdown-aware replacement
      await googleDocs.replaceTextWithMarkdown({
        documentId: docId,
        textToReplace: replaced,
        markdownReplacement: text,
        matchCase,
        tabIds,
      });
    } else {
      // Use plain text replacement (original behavior)
      const textObject = {
        replaceText: text,
        containsText: {
          text: replaced,
          matchCase,
        },
        tabsCriteria: tabIds
          ? {
            tabIds,
          }
          : undefined,
      };
      await googleDocs.replaceText(docId, textObject);
    }
    const doc = await googleDocs.getDocument(docId);
    $.export("$summary", `Successfully replaced text in doc with ID: ${docId}`);
    return doc;
  },
};
