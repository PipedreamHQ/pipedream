import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_docs-update-text-style",
  name: "Update Text Style",
  description: "Apply character formatting — bold, italic, underline, font, size, color, or a link — to a range of text in a Google Doc. Only the options you fill in are changed; everything you leave blank keeps its current formatting — except that setting **Font Family** without **Font Weight** resets the range weight to the API default of `400`. Use **Get Document** to find the start and end index of the text you want to style, or **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#UpdateTextStyleRequest)",
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
    },
    endIndex: {
      propDefinition: [
        googleDocs,
        "endIndex",
      ],
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "`true` bolds the range; `false` removes bold. Omit to leave the range current bold setting untouched.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "`true` italicizes the range; `false` removes italics. Omit to leave the range current italic setting untouched.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "`true` underlines the range; `false` removes the underline. Omit to leave the range current underline setting untouched.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "`true` strikes through the range; `false` removes the strikethrough. Omit to leave the range current setting untouched.",
      optional: true,
    },
    smallCaps: {
      type: "boolean",
      label: "Small Caps",
      description: "`true` renders the range in small capitals; `false` returns it to normal casing. Omit to leave the range current setting untouched.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font family to apply, as a font name Google Docs recognizes (e.g. `Roboto`, `Times New Roman`, `Arial`). Setting this without **Font Weight** applies the API default weight of `400`, which clears an existing bold weight on the range.",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "The font size in points (e.g. `12`).",
      optional: true,
      min: 1,
    },
    fontWeight: {
      type: "integer",
      label: "Font Weight",
      description: "Weight of the font as a multiple of 100 between `100` and `900`, where `400` is normal and `700` is bold. Only valid alongside **Font Family**. Set it whenever you change the font on text that should stay heavy, since the API otherwise defaults the weight to `400`.",
      optional: true,
      min: 100,
      max: 900,
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
      description: "Vertical offset of the range relative to the normal baseline. `NONE` sits on the baseline, `SUPERSCRIPT` raises it, `SUBSCRIPT` lowers it.",
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
      description: "Turn the range into a hyperlink pointing at this URL (e.g. `https://example.com`).",
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

    if (this.fontWeight != null && !this.fontFamily) {
      throw new ConfigurationError("Font Weight only applies alongside Font Family. Set Font Family as well, or use Bold to embolden the range in its existing font.");
    }
    if (this.fontWeight != null && this.fontWeight % 100 !== 0) {
      throw new ConfigurationError(`Font Weight must be a multiple of 100 between 100 and 900, got \`${this.fontWeight}\`.`);
    }

    // The API applies weightedFontFamily before bold and defaults an omitted
    // weight to 400, so changing only the family silently unbolds the range.
    // Sending the weight the user asked for keeps that explicit.
    const weightedFontFamily = this.fontFamily
      ? {
        fontFamily: this.fontFamily,
      }
      : undefined;
    if (weightedFontFamily && this.fontWeight != null) {
      weightedFontFamily.weight = this.fontWeight;
    }
    const link = this.linkUrl
      ? {
        url: this.linkUrl,
      }
      : undefined;

    const {
      style, fields, isEmpty,
    } = styling.buildStyle({
      bold: this.bold,
      italic: this.italic,
      underline: this.underline,
      strikethrough: this.strikethrough,
      smallCaps: this.smallCaps,
      baselineOffset: this.baselineOffset,
      weightedFontFamily,
      fontSize: styling.points(this.fontSize),
      foregroundColor: styling.optionalColor(this.foregroundColor, "Text Color"),
      backgroundColor: styling.optionalColor(this.backgroundColor, "Highlight Color"),
      link,
    });

    if (isEmpty) {
      throw new ConfigurationError("Set at least one style option (e.g. Bold, Font Size, or Text Color) — otherwise there is nothing to update.");
    }

    await this.googleDocs._batchUpdate(this.documentId, "updateTextStyle", {
      range,
      textStyle: style,
      fields,
    });

    $.export("$summary", `Updated text style for characters ${range.startIndex}–${range.endIndex} in document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
