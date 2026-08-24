import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_slides-update-paragraph-style",
  name: "Update Paragraph Style",
  description: "Apply paragraph formatting — alignment, line spacing, indentation, or spacing above and below — to the paragraphs in a shape or a table cell. Only the options you fill in are changed; everything you leave blank keeps its current formatting. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateParagraphStyleRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSlides,
    presentationId: {
      propDefinition: [
        googleSlides,
        "presentationId",
      ],
    },
    slideId: {
      propDefinition: [
        googleSlides,
        "slideId",
        (c) => ({
          presentationId: c.presentationId,
        }),
      ],
    },
    shapeId: {
      propDefinition: [
        googleSlides,
        "shapeId",
        (c) => ({
          presentationId: c.presentationId,
          slideId: c.slideId,
        }),
      ],
      description: "The shape or table whose paragraphs you want to style.",
    },
    rowIndex: {
      propDefinition: [
        googleSlides,
        "rowIndex",
      ],
      description: "Zero-based row of the table cell to style. Leave blank — along with **Column Index** — when the target is a shape rather than a table.",
    },
    columnIndex: {
      propDefinition: [
        googleSlides,
        "columnIndex",
      ],
      description: "Zero-based column of the table cell to style. Leave blank — along with **Row Index** — when the target is a shape rather than a table.",
    },
    rangeType: {
      propDefinition: [
        googleSlides,
        "rangeType",
      ],
    },
    startIndex: {
      propDefinition: [
        googleSlides,
        "startIndex",
      ],
    },
    endIndex: {
      propDefinition: [
        googleSlides,
        "endIndex",
      ],
    },
    alignment: {
      type: "string",
      label: "Alignment",
      description: "How the paragraph text is aligned. `START` and `END` align to the leading and trailing margin for the text direction (left and right respectively in a left-to-right presentation), `CENTER` centers it, and `JUSTIFIED` stretches it to both margins.",
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
      description: "Indentation of the whole paragraph from the start-side margin, in points (the left margin in a left-to-right presentation).",
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
    spacingMode: {
      type: "string",
      label: "Spacing Mode",
      description: "Whether space above and below still applies next to a list. `NEVER_COLLAPSE` always applies the spacing; `COLLAPSE_LISTS` skips it between list elements.",
      optional: true,
      options: [
        "NEVER_COLLAPSE",
        "COLLAPSE_LISTS",
      ],
    },
    direction: {
      type: "string",
      label: "Text Direction",
      description: "The reading direction of the paragraph text. `LEFT_TO_RIGHT` for scripts such as Latin, `RIGHT_TO_LEFT` for scripts such as Arabic or Hebrew.",
      optional: true,
      options: [
        "LEFT_TO_RIGHT",
        "RIGHT_TO_LEFT",
      ],
    },
  },
  async run({ $ }) {
    const builder = styling.styleBuilder();
    builder.set("alignment", this.alignment);
    builder.set("lineSpacing", this.lineSpacing);
    builder.set("spacingMode", this.spacingMode);
    builder.set("direction", this.direction);
    builder.set("spaceAbove", styling.points(this.spaceAbove, "Space Above"));
    builder.set("spaceBelow", styling.points(this.spaceBelow, "Space Below"));
    builder.set("indentStart", styling.points(this.indentStart, "Indent Start"));
    builder.set("indentEnd", styling.points(this.indentEnd, "Indent End"));
    builder.set("indentFirstLine", styling.points(this.indentFirstLine, "First Line Indent"));

    const {
      style, fields, isEmpty,
    } = builder.result();
    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Alignment, Line Spacing, or Indent Start) — otherwise there is nothing to update.");
    }

    const request = {
      objectId: this.shapeId,
      textRange: styling.buildTextRange(this.rangeType ?? "ALL", this.startIndex, this.endIndex),
      style,
      fields,
    };
    const cellLocation = styling.buildCellLocation(
      this.rowIndex,
      this.columnIndex,
      "when the target is a shape rather than a table",
    );
    if (cellLocation) {
      request.cellLocation = cellLocation;
    }

    const response = await this.googleSlides.batchUpdate(this.presentationId, [
      {
        updateParagraphStyle: request,
      },
    ]);

    $.export("$summary", `Successfully updated paragraph style on object with ID: ${this.shapeId}`);
    return response.data;
  },
};
