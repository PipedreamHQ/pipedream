import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_slides-update-text-style",
  name: "Update Text Style",
  description: "Apply character formatting — bold, italic, underline, font, size, color, or a link — to the text in a shape or a table cell. Only the options you fill in are changed; everything you leave blank keeps its current formatting. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateTextStyleRequest)",
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
      description: "The shape or table whose text you want to style.",
    },
    rowIndex: {
      type: "integer",
      label: "Row Index",
      description: "Zero-based row of the table cell to style. Leave blank — along with **Column Index** — when the target is a shape rather than a table.",
      optional: true,
      min: 0,
    },
    columnIndex: {
      type: "integer",
      label: "Column Index",
      description: "Zero-based column of the table cell to style. Leave blank — along with **Row Index** — when the target is a shape rather than a table.",
      optional: true,
      min: 0,
    },
    rangeType: {
      type: "string",
      label: "Range Type",
      description: "Which part of the text to style. `ALL` covers everything and ignores the indices below.",
      optional: true,
      default: "ALL",
      options: [
        "ALL",
        "FROM_START_INDEX",
        "FIXED_RANGE",
      ],
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "Zero-based index where styling begins. Required when **Range Type** is `FROM_START_INDEX` or `FIXED_RANGE`.",
      optional: true,
      min: 0,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "Zero-based index where styling ends, exclusive. Required when **Range Type** is `FIXED_RANGE`.",
      optional: true,
      min: 1,
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Set `true` to bold the text, or `false` to explicitly remove bold. Leave blank to keep the current setting.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Set `true` to italicize the text, or `false` to explicitly remove italics. Leave blank to keep the current setting.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "Set `true` to underline the text, or `false` to explicitly remove the underline. Leave blank to keep the current setting.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Set `true` to strike through the text, or `false` to explicitly remove it. Leave blank to keep the current setting.",
      optional: true,
    },
    smallCaps: {
      type: "boolean",
      label: "Small Caps",
      description: "Set `true` to render the text in small capitals, or `false` to explicitly remove it. Leave blank to keep the current setting.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font to apply, named exactly as it appears in the Slides font menu (e.g. `Roboto`, `Times New Roman`).",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "The font size in points (e.g. `18`).",
      optional: true,
      min: 1,
    },
    foregroundColor: {
      type: "string",
      label: "Text Color",
      description: "The text color as a 6-digit hex code (e.g. `#FF0000` for red).",
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Highlight Color",
      description: "The text highlight color as a 6-digit hex code (e.g. `#FFFF00` for yellow).",
      optional: true,
    },
    baselineOffset: {
      type: "string",
      label: "Baseline Offset",
      description: "Render the text raised or lowered relative to the normal baseline.",
      optional: true,
      options: [
        "NONE",
        "SUPERSCRIPT",
        "SUBSCRIPT",
      ],
    },
    linkUrl: {
      type: "string",
      label: "Link URL",
      description: "Turn the text into a hyperlink pointing at this URL (e.g. `https://example.com`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const builder = styling.styleBuilder();
    builder.set("bold", this.bold);
    builder.set("italic", this.italic);
    builder.set("underline", this.underline);
    builder.set("strikethrough", this.strikethrough);
    builder.set("smallCaps", this.smallCaps);
    builder.set("baselineOffset", this.baselineOffset);
    builder.set("fontFamily", this.fontFamily);
    builder.set("fontSize", styling.points(this.fontSize));
    builder.set("foregroundColor", styling.optionalColor(this.foregroundColor, "Text Color"));
    builder.set("backgroundColor", styling.optionalColor(this.backgroundColor, "Highlight Color"));
    if (this.linkUrl) {
      builder.set("link", {
        url: this.linkUrl,
      });
    }

    const {
      style, fields, isEmpty,
    } = builder.result();
    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Bold, Font Size, or Text Color) — otherwise there is nothing to update.");
    }

    const request = {
      objectId: this.shapeId,
      textRange: styling.buildTextRange(this.rangeType ?? "ALL", this.startIndex, this.endIndex),
      style,
      fields,
    };
    const cellLocation = styling.buildCellLocation(this.rowIndex, this.columnIndex);
    if (cellLocation) {
      request.cellLocation = cellLocation;
    }

    const response = await this.googleSlides.batchUpdate(this.presentationId, [
      {
        updateTextStyle: request,
      },
    ]);

    $.export("$summary", `Successfully updated text style on object with ID: ${this.shapeId}`);
    return response.data;
  },
};
