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
    bold: {
      type: "boolean",
      label: "Bold",
      description: "`true` bolds the text; `false` removes bold. Omit to leave the current bold setting untouched.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "`true` italicizes the text; `false` removes italics. Omit to leave the current italic setting untouched.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "`true` underlines the text; `false` removes the underline. Omit to leave the current underline setting untouched.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "`true` strikes through the text; `false` removes the strikethrough. Omit to leave the current setting untouched.",
      optional: true,
    },
    smallCaps: {
      type: "boolean",
      label: "Small Caps",
      description: "`true` renders the text in small capitals; `false` returns it to normal casing. Omit to leave the current setting untouched.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font family to apply, as a font name Google Slides recognizes (e.g. `Roboto`, `Times New Roman`, `Arial`).",
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
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      label: "Highlight Color",
      description: "The text highlight color as a 6-digit hex code (e.g. `#FFFF00` for yellow).",
    },
    baselineOffset: {
      type: "string",
      label: "Baseline Offset",
      description: "Vertical offset of the text relative to the normal baseline. `NONE` sits on the baseline, `SUPERSCRIPT` raises it, `SUBSCRIPT` lowers it.",
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
    builder.set("fontSize", styling.points(this.fontSize, "Font Size"));
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
        updateTextStyle: request,
      },
    ]);

    $.export("$summary", `Successfully updated text style on object with ID: ${this.shapeId}`);
    return response.data;
  },
};
