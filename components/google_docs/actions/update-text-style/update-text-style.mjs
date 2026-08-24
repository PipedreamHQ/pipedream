import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import styling from "../../common/styling.mjs";

export default {
  key: "google_docs-update-text-style",
  name: "Update Text Style",
  description: "Apply character formatting — bold, italic, underline, font, size, color, or a link — to a range of text in a Google Doc. Only the options you fill in are changed; everything you leave blank keeps its current formatting. Use **Get Document** to find the start and end index of the text you want to style, or **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#UpdateTextStyleRequest)",
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
      type: "integer",
      label: "Start Index",
      description: "The character index where the styled range begins, counting from the start of the document body. Must be at least `1`. Use **Get Document** to inspect the document's structure and locate the range.",
      min: 1,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "The character index where the styled range ends, exclusive. Must be greater than **Start Index**.",
      min: 2,
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Set `true` to bold the range, or `false` to explicitly remove bold. Leave blank to keep the current setting.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Set `true` to italicize the range, or `false` to explicitly remove italics. Leave blank to keep the current setting.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "Set `true` to underline the range, or `false` to explicitly remove the underline. Leave blank to keep the current setting.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Set `true` to strike through the range, or `false` to explicitly remove it. Leave blank to keep the current setting.",
      optional: true,
    },
    smallCaps: {
      type: "boolean",
      label: "Small Caps",
      description: "Set `true` to render the range in small capitals, or `false` to explicitly remove it. Leave blank to keep the current setting.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "The font to apply, named exactly as it appears in the Google Docs font menu (e.g. `Roboto`, `Times New Roman`).",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "The font size in points (e.g. `12`).",
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
      description: "Render the range raised or lowered relative to the normal baseline.",
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

    const weightedFontFamily = this.fontFamily
      ? {
        fontFamily: this.fontFamily,
      }
      : undefined;
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
