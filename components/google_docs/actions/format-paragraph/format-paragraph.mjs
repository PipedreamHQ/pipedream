import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";
import {
  ALIGNMENTS, NAMED_STYLE_TYPES,
} from "../../common/constants.mjs";

export default {
  key: "google_docs-format-paragraph",
  name: "Format Paragraph",
  description: "Apply paragraph formatting (heading style, alignment, line spacing, indentation) in a Google Doc. Locate the paragraph with **Find Text**, or pass an explicit **Start Index** and **End Index**. Google Docs applies paragraph styles to whole paragraphs, so every paragraph the range touches is restyled, not just the matched text. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateParagraphStyleRequest)",
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
    namedStyleType: {
      type: "string",
      label: "Paragraph Style",
      description: "Named style to apply, e.g. `HEADING_1` for a top-level heading or `NORMAL_TEXT` to clear one.",
      options: NAMED_STYLE_TYPES,
      optional: true,
    },
    alignment: {
      type: "string",
      label: "Alignment",
      description: "Paragraph alignment. `START` is left-aligned in a left-to-right document.",
      options: ALIGNMENTS,
      optional: true,
    },
    lineSpacing: {
      type: "integer",
      label: "Line Spacing",
      description: "Line spacing as a percentage of normal (100 = single, 150 = 1.5x, 200 = double). Range 1-1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
    spaceAbove: {
      type: "integer",
      label: "Space Above",
      description: "Space above the paragraph, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    spaceBelow: {
      type: "integer",
      label: "Space Below",
      description: "Space below the paragraph, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    indentStart: {
      type: "integer",
      label: "Indent Start",
      description: "Indentation from the start (left, in a left-to-right document) side, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    indentEnd: {
      type: "integer",
      label: "Indent End",
      description: "Indentation from the end (right, in a left-to-right document) side, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    keepLinesTogether: {
      type: "boolean",
      label: "Keep Lines Together",
      description: "Set `true` to keep the paragraph's lines on one page where possible, `false` to allow it to break across pages. Leave unset to keep it unchanged.",
      optional: true,
    },
    keepWithNext: {
      type: "boolean",
      label: "Keep With Next",
      description: "Set `true` to keep at least part of the paragraph on the same page as the paragraph that follows it. Leave unset to keep it unchanged.",
      optional: true,
    },
    indentFirstLine: {
      type: "integer",
      label: "First Line Indent",
      description: "Indentation of the paragraph's first line, in points (0-500).",
      min: 0,
      max: 500,
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
      namedStyleType,
      alignment,
      lineSpacing,
      spaceAbove,
      spaceBelow,
      indentStart,
      indentEnd,
      indentFirstLine,
      keepLinesTogether,
      keepWithNext,
    } = this;

    const builder = utils.styleBuilder();

    builder.set("namedStyleType", namedStyleType);
    builder.set("alignment", alignment);
    builder.set("lineSpacing", lineSpacing);
    builder.setDimension("spaceAbove", spaceAbove);
    builder.setDimension("spaceBelow", spaceBelow);
    builder.setDimension("indentStart", indentStart);
    builder.setDimension("indentEnd", indentEnd);
    builder.setDimension("indentFirstLine", indentFirstLine);
    builder.set("keepLinesTogether", keepLinesTogether);
    builder.set("keepWithNext", keepWithNext);

    if (builder.isEmpty) {
      throw new ConfigurationError("Provide at least one formatting option (for example Paragraph Style, Alignment, or Line Spacing).");
    }

    const ranges = await googleDocs.resolveStyleRanges(documentId, {
      find,
      matchCase,
      occurrence,
      startIndex,
      endIndex,
      tabId,
    });

    await googleDocs.batchUpdate(documentId, ranges.map((range) => ({
      updateParagraphStyle: {
        range,
        paragraphStyle: builder.style,
        fields: builder.mask,
      },
    })));

    $.export("$summary", `Formatted ${ranges.length} paragraph range${ranges.length === 1
      ? ""
      : "s"} in document ${documentId}`);

    return {
      documentId,
      rangesUpdated: ranges.length,
      ranges,
      fieldsUpdated: builder.fields,
    };
  },
};
