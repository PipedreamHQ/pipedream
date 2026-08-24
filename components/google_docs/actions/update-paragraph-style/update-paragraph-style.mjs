import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_docs-update-paragraph-style",
  name: "Update Paragraph Style",
  description: "Apply paragraph formatting — heading level, alignment, line spacing, indentation, or spacing above and below — to every paragraph overlapping a range in a Google Doc. Only the options you fill in are changed; everything you leave blank keeps its current formatting. Use **Get Document** to find the start and end index of the paragraphs you want to style. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#UpdateParagraphStyleRequest)",
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
    startIndex: {
      propDefinition: [
        googleDocs,
        "startIndex",
      ],
      description: "The index where the range begins, counted in zero-based UTF-16 code units from the start of the document body — not in Unicode characters, so astral characters such as emoji count as two. Must be at least `1`. Every paragraph that overlaps the range is restyled, even if the range covers only part of it.",
    },
    endIndex: {
      propDefinition: [
        googleDocs,
        "endIndex",
      ],
    },
    namedStyleType: {
      type: "string",
      label: "Named Style",
      description: "The named paragraph style to apply. `NORMAL_TEXT` is body text, `TITLE` and `SUBTITLE` are document-level styles, and `HEADING_1` through `HEADING_6` are section headings in descending order of prominence.",
      optional: true,
      options: [
        "NORMAL_TEXT",
        "TITLE",
        "SUBTITLE",
        "HEADING_1",
        "HEADING_2",
        "HEADING_3",
        "HEADING_4",
        "HEADING_5",
        "HEADING_6",
      ],
    },
    alignment: {
      type: "string",
      label: "Alignment",
      description: "How the paragraph text is aligned. `START` and `END` align to the leading and trailing margin for the text direction (left and right respectively in a left-to-right document), `CENTER` centers it, and `JUSTIFIED` stretches it to both margins.",
      optional: true,
      options: [
        "START",
        "CENTER",
        "END",
        "JUSTIFIED",
      ],
    },
    lineSpacing: {
      type: "integer",
      label: "Line Spacing",
      description: "Line spacing as a percentage of normal, where `100` is single-spaced, `150` is one-and-a-half, and `200` is double-spaced.",
      optional: true,
      min: 1,
    },
    spaceAbove: {
      type: "integer",
      label: "Space Above",
      description: "Extra space above the paragraph, in points.",
      optional: true,
      min: 0,
    },
    spaceBelow: {
      type: "integer",
      label: "Space Below",
      description: "Extra space below the paragraph, in points.",
      optional: true,
      min: 0,
    },
    indentStart: {
      type: "integer",
      label: "Indent Start",
      description: "Indentation of the whole paragraph from the start-side margin, in points (the left margin in a left-to-right document).",
      optional: true,
      min: 0,
    },
    indentEnd: {
      type: "integer",
      label: "Indent End",
      description: "Indentation of the whole paragraph from the end-side margin, in points.",
      optional: true,
      min: 0,
    },
    indentFirstLine: {
      type: "integer",
      label: "First Line Indent",
      description: "Indentation of the paragraph's first line only, in points.",
      optional: true,
      min: 0,
    },
    keepLinesTogether: {
      type: "boolean",
      label: "Keep Lines Together",
      description: "`true` keeps the paragraph lines on a single page where possible; `false` allows it to break across pages. Omit to leave the paragraph current setting untouched.",
      optional: true,
    },
    keepWithNext: {
      type: "boolean",
      label: "Keep With Next",
      description: "`true` keeps at least part of this paragraph on the same page as the paragraph that follows it; `false` allows them to be separated. Omit to leave the paragraph current setting untouched.",
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "tabId",
      ],
    },
  },
  async run({ $ }) {
    const range = styling.buildRange(this.startIndex, this.endIndex, this.tabId);

    const {
      style, fields, isEmpty,
    } = styling.buildStyle({
      namedStyleType: this.namedStyleType,
      alignment: this.alignment,
      lineSpacing: this.lineSpacing,
      keepLinesTogether: this.keepLinesTogether,
      keepWithNext: this.keepWithNext,
      spaceAbove: styling.points(this.spaceAbove),
      spaceBelow: styling.points(this.spaceBelow),
      indentStart: styling.points(this.indentStart),
      indentEnd: styling.points(this.indentEnd),
      indentFirstLine: styling.points(this.indentFirstLine),
    });

    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Named Style, Alignment, or Line Spacing) — otherwise there is nothing to update.");
    }

    await this.googleDocs.updateParagraphStyle(this.documentId, {
      range,
      paragraphStyle: style,
      fields,
    });

    $.export("$summary", `Updated paragraph style for characters ${range.startIndex}–${range.endIndex} in document ${this.documentId}`);
    return this.googleDocs.getDocumentOrTab(this.documentId, this.tabId);
  },
};
