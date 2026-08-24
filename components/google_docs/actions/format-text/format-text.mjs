import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import {
  BASELINE_OFFSETS, FONT_WEIGHT_MAX, FONT_WEIGHT_MIN, FONT_WEIGHT_STEP, POINTS,
} from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-format-text",
  name: "Format Text",
  description: "Apply character formatting (bold, italic, underline, strikethrough, font, size, color, link) to text in a Google Doc. Locate the text with **Find Text**, or pass an explicit **Start Index** and **End Index**. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTextStyleRequest)",
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
      description: "Font family name as it appears in the Google Docs font menu, e.g. `Roboto` or `Times New Roman`. The API resets the range's weight to `400` whenever the family changes, so set **Font Weight** (or **Bold**) as well to keep heavy text heavy.",
      optional: true,
    },
    fontWeight: {
      type: "integer",
      label: "Font Weight",
      description: "Rendered weight of the font, a multiple of 100 from 100 to 900 (`400` is normal, `700` is bold). Only valid alongside **Font Family**, and worth setting whenever you change the font of text that should stay heavy.",
      min: 100,
      max: 900,
      optional: true,
    },
    foregroundColor: {
      type: "string",
      label: "Text Color",
      description: "Text color as a hex code, e.g. `#FF0000`.",
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Highlight Color",
      description: "Highlight (background) color as a hex code, e.g. `#FFFF00`.",
      optional: true,
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
      googleDocs,
      documentId,
      find,
      occurrence,
      matchCase,
      startIndex,
      endIndex,
      tabId,
      bold,
      italic,
      underline,
      strikethrough,
      smallCaps,
      baselineOffset,
      fontSize,
      fontFamily,
      fontWeight,
      foregroundColor,
      backgroundColor,
      link,
    } = this;

    // The API applies exactly the fields named in the mask, so the style object
    // and the mask are built together from whatever the caller actually set.
    const textStyle = {};
    const fields = [];
    const setField = (name, value) => {
      if (value == null) {
        return;
      }
      textStyle[name] = value;
      fields.push(name);
    };

    setField("bold", bold);
    setField("italic", italic);
    setField("underline", underline);
    setField("strikethrough", strikethrough);
    setField("smallCaps", smallCaps);
    setField("baselineOffset", baselineOffset);

    if (fontSize != null) {
      setField("fontSize", {
        magnitude: fontSize,
        unit: POINTS,
      });
    }
    if (fontWeight != null && !fontFamily) {
      throw new ConfigurationError("Font Weight only applies alongside Font Family. Set Font Family too, or use Bold to embolden the text in its current font.");
    }
    if (fontWeight != null && (fontWeight % FONT_WEIGHT_STEP
      || fontWeight < FONT_WEIGHT_MIN || fontWeight > FONT_WEIGHT_MAX)) {
      throw new ConfigurationError(`Font Weight must be a multiple of ${FONT_WEIGHT_STEP} between ${FONT_WEIGHT_MIN} and ${FONT_WEIGHT_MAX}, got ${fontWeight}.`);
    }
    if (fontFamily) {
      // The API applies weightedFontFamily before bold and substitutes weight
      // 400 when it is omitted, so hardcoding a weight here would silently
      // unbold any text whose font was changed. Send only what was asked for.
      setField("weightedFontFamily", {
        fontFamily,
        ...(fontWeight != null && {
          weight: fontWeight,
        }),
      });
    }
    if (link) {
      setField("link", {
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
      const color = utils.hexToOptionalColor(value);
      if (!color) {
        throw new ConfigurationError(`${label} "${value}" is not a valid hex color. Use a 6-digit hex code such as \`#FF0000\`.`);
      }
      setField(name, color);
    });

    if (!fields.length) {
      throw new ConfigurationError("Provide at least one formatting option (for example Bold, Font Size, or Text Color).");
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
      updateTextStyle: {
        range,
        textStyle,
        fields: fields.join(","),
      },
    })));

    $.export("$summary", `Formatted ${ranges.length} range${ranges.length === 1
      ? ""
      : "s"} in document ${documentId}`);

    return {
      documentId,
      rangesUpdated: ranges.length,
      ranges,
      fieldsUpdated: fields,
    };
  },
};
