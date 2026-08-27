import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import utils from "../../common/utils.mjs";
import {
  BASELINE_OFFSETS, POINTS,
} from "../../common/constants.mjs";

export default {
  key: "google_slides-format-text",
  name: "Format Text",
  description: "Apply character formatting (bold, italic, underline, strikethrough, font, size, color, link) to the text of a shape or table cell in a Google Slides presentation. Use **Get Presentation** to find the page element's object ID. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateTextStyleRequest)",
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
        "staticPresentationId",
      ],
    },
    objectId: {
      propDefinition: [
        googleSlides,
        "pageElementId",
      ],
      description: "The object ID of the shape or table whose text should be styled. Use **Get Presentation** and read `slides[].pageElements[].objectId`.",
    },
    rowIndex: {
      propDefinition: [
        googleSlides,
        "rowIndex",
      ],
      label: "Table Row Index",
      description: "Required only when **Page Element ID** refers to a table: the 0-based row of the cell to style.",
    },
    columnIndex: {
      propDefinition: [
        googleSlides,
        "columnIndex",
      ],
      label: "Table Column Index",
      description: "Required only when **Page Element ID** refers to a table: the 0-based column of the cell to style.",
    },
    startIndex: {
      propDefinition: [
        googleSlides,
        "startIndex",
      ],
      description: "Character index to style from, inclusive. On its own, styles from here to the end of the text. Omit both indices to style all of it.",
    },
    endIndex: {
      propDefinition: [
        googleSlides,
        "endIndex",
      ],
      description: "Character index to style up to, exclusive. Requires **Start Index**, and must be greater than it.",
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Set `true` to bold the text, `false` to remove bold. Leave unset to keep it unchanged.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Set `true` to italicize the text, `false` to remove italics. Leave unset to keep it unchanged.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "Set `true` to underline the text, `false` to remove the underline. Leave unset to keep it unchanged.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Set `true` to strike through the text, `false` to remove it. Leave unset to keep it unchanged.",
      optional: true,
    },
    smallCaps: {
      type: "boolean",
      label: "Small Caps",
      description: "Set `true` to render the text in small capitals, `false` to return it to normal casing. Leave unset to keep it unchanged.",
      optional: true,
    },
    baselineOffset: {
      type: "string",
      label: "Baseline Offset",
      description: "Vertical offset from the normal baseline. `SUPERSCRIPT` and `SUBSCRIPT` are also rendered in a smaller font, computed from the current size.",
      options: BASELINE_OFFSETS,
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "Font size in points (1-400).",
      min: 1,
      max: 400,
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "Font family name as it appears in the Slides font menu, e.g. `Roboto`.",
      optional: true,
    },
    foregroundColor: {
      type: "string",
      label: "Text Color",
      description: "Hex code (e.g. `#FF0000`) or one of the deck's theme colors (e.g. `ACCENT1`, `DARK1`).",
      optional: true,
    },
    backgroundColor: {
      propDefinition: [
        googleSlides,
        "backgroundColor",
      ],
      label: "Highlight Color",
      description: "Hex code (e.g. `#FFFF00`) or one of the deck's theme colors (e.g. `ACCENT2`).",
    },
    link: {
      type: "string",
      label: "Link URL",
      description: "Turn the text into a hyperlink pointing at this URL.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleSlides,
      presentationId,
      objectId,
      rowIndex,
      columnIndex,
      startIndex,
      endIndex,
      bold,
      italic,
      underline,
      strikethrough,
      smallCaps,
      baselineOffset,
      fontSize,
      fontFamily,
      foregroundColor,
      backgroundColor,
      link,
    } = this;

    const builder = utils.styleBuilder();

    builder.set("bold", bold);
    builder.set("italic", italic);
    builder.set("underline", underline);
    builder.set("strikethrough", strikethrough);
    builder.set("smallCaps", smallCaps);
    builder.set("baselineOffset", baselineOffset);

    if (fontSize != null) {
      builder.set("fontSize", {
        magnitude: fontSize,
        unit: POINTS,
      });
    }
    if (fontFamily) {
      builder.set("fontFamily", fontFamily);
    }
    if (link) {
      builder.set("link", {
        url: link,
      });
    }

    [
      [
        "foregroundColor",
        foregroundColor,
        "Text Color",
      ],
      [
        "backgroundColor",
        backgroundColor,
        "Highlight Color",
      ],
    ].forEach(([
      name,
      value,
      label,
    ]) => {
      if (!value) {
        return;
      }
      const solidFill = utils.toSolidFill(value);
      if (!solidFill) {
        throw new ConfigurationError(`${label} "${value}" is not a valid hex color or theme color name. Use a 6-digit hex code such as \`#FF0000\`, or a theme color such as \`ACCENT1\`.`);
      }
      builder.set(name, {
        opaqueColor: solidFill.color,
      });
    });

    if (builder.isEmpty) {
      throw new ConfigurationError("Provide at least one formatting option (for example Bold, Font Size, or Text Color).");
    }

    if ((rowIndex == null) !== (columnIndex == null)) {
      throw new ConfigurationError("Table Row Index and Table Column Index must be provided together.");
    }

    const textRange = utils.buildTextRange(startIndex, endIndex);

    const request = {
      objectId,
      style: builder.style,
      textRange,
      fields: builder.mask,
      ...(rowIndex != null && {
        cellLocation: {
          rowIndex,
          columnIndex,
        },
      }),
    };

    await googleSlides.batchUpdate(googleSlides.getPresentationId(presentationId), [
      {
        updateTextStyle: request,
      },
    ]);

    $.export("$summary", `Formatted text on element ${objectId}`);

    return {
      presentationId,
      objectId,
      fieldsUpdated: builder.fields,
      textRange,
    };
  },
};
