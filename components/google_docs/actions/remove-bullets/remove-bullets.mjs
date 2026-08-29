import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-remove-bullets",
  name: "Remove Bullets",
  description: "Remove bullets or numbering from list paragraphs in a Google Doc, leaving the text in place. Locate the paragraphs with **Find Text**, or pass an explicit **Start Index** and **End Index**. Every paragraph the range touches is affected. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteParagraphBulletsRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
      propDefinition: [
        googleDocs,
        "findText",
      ],
    },
    occurrence: {
      propDefinition: [
        googleDocs,
        "occurrence",
      ],
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
    startIndex: {
      propDefinition: [
        googleDocs,
        "startIndex",
      ],
    },
    endIndex: {
      propDefinition: [
        googleDocs,
        "endIndex",
      ],
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      find,
      occurrence,
      matchCase,
      startIndex,
      endIndex,
      tabId,
    } = this;

    const ranges = await googleDocs.resolveStyleRanges(documentId, {
      find,
      matchCase,
      occurrence,
      startIndex,
      endIndex,
      tabId,
    });

    await googleDocs.batchUpdate(documentId, ranges.map((range) => ({
      deleteParagraphBullets: {
        range,
      },
    })));

    $.export("$summary", `Removed bullets from ${ranges.length} range${ranges.length === 1
      ? ""
      : "s"} in document ${documentId}`);

    return {
      documentId,
      rangesUpdated: ranges.length,
      ranges,
    };
  },
};
