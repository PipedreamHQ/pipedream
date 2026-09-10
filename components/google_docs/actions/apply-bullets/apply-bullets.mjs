import googleDocs from "../../google_docs.app.mjs";
import { BULLET_PRESETS } from "../../common/constants.mjs";

export default {
  key: "google_docs-apply-bullets",
  name: "Apply Bullets",
  description: "Turn paragraphs into a bulleted or numbered list in a Google Doc. Locate the paragraphs with **Find Text**, or pass an explicit **Start Index** and **End Index**. Every paragraph the range touches becomes a list item. Use **Remove Bullets** to undo. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateParagraphBulletsRequest)",
  version: "0.0.2",
  ai: "optimized",
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
    bulletPreset: {
      type: "string",
      label: "Bullet Preset",
      description: "The glyph sequence to use. `BULLET_*` presets are unordered lists, `NUMBERED_*` presets are ordered lists.",
      options: BULLET_PRESETS,
      default: "BULLET_DISC_CIRCLE_SQUARE",
      optional: true,
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
      bulletPreset,
    } = this;

    const ranges = await googleDocs.resolveStyleRanges(documentId, {
      find,
      matchCase,
      occurrence,
      startIndex,
      endIndex,
      tabId,
    });

    // createParagraphBullets strips the leading tabs it uses to infer nesting,
    // and the API documents that this may change the indices of text after the
    // range it edits. Sending the ranges from the end of the document backwards
    // keeps the earlier, still-unapplied ranges valid.
    const ordered = [
      ...ranges,
    ].sort((a, b) => b.startIndex - a.startIndex);

    await googleDocs.batchUpdate(documentId, ordered.map((range) => ({
      createParagraphBullets: {
        range,
        bulletPreset,
      },
    })));

    $.export("$summary", `Applied bullets to ${ranges.length} range${ranges.length === 1
      ? ""
      : "s"} in document ${documentId}`);

    return {
      documentId,
      rangesUpdated: ranges.length,
      ranges,
      bulletPreset,
    };
  },
};
