import { ConfigurationError } from "@pipedream/platform";
import googleSlides from "../../google_slides.app.mjs";
import utils from "../../common/utils.mjs";
import {
  ALIGNMENTS, BULLETS_NONE, BULLET_PRESETS, SPACING_MODES, TEXT_DIRECTIONS,
} from "../../common/constants.mjs";

export default {
  key: "google_slides-format-paragraph",
  name: "Format Paragraph",
  description: "Apply paragraph formatting (alignment, line spacing, indentation, bullets) to the text of a shape or table cell in a Google Slides presentation. Use **Get Presentation** to find the page element's object ID. [See the documentation](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#UpdateParagraphStyleRequest)",
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
      description: "The object ID of the shape or table whose paragraphs should be styled. Use **Get Presentation** and read `slides[].pageElements[].objectId`.",
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
    alignment: {
      type: "string",
      label: "Alignment",
      description: "Paragraph alignment. `START` is left-aligned in a left-to-right deck.",
      options: ALIGNMENTS,
      optional: true,
    },
    lineSpacing: {
      type: "integer",
      label: "Line Spacing",
      description: "Line spacing as a percentage of normal (100 = single, 150 = 1.5x). Range 1-1000.",
      min: 1,
      max: 1000,
      optional: true,
    },
    spaceAbove: {
      type: "integer",
      label: "Space Above",
      description: "Space above each paragraph, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    spaceBelow: {
      type: "integer",
      label: "Space Below",
      description: "Space below each paragraph, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    indentStart: {
      type: "integer",
      label: "Indent Start",
      description: "Indentation from the start side, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    indentEnd: {
      type: "integer",
      label: "Indent End",
      description: "Indentation from the end side, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    indentFirstLine: {
      type: "integer",
      label: "First Line Indent",
      description: "Indentation of each paragraph's first line, in points (0-500).",
      min: 0,
      max: 500,
      optional: true,
    },
    direction: {
      type: "string",
      label: "Text Direction",
      description: "Reading direction of the paragraph. Unlike the other options this is not inherited, and defaults to `LEFT_TO_RIGHT` when unset.",
      options: TEXT_DIRECTIONS,
      optional: true,
    },
    spacingMode: {
      type: "string",
      label: "Spacing Mode",
      description: "How paragraph spacing is rendered. `NEVER_COLLAPSE` always renders it; `COLLAPSE_LISTS` skips it between list items.",
      options: SPACING_MODES,
      optional: true,
    },
    bullets: {
      type: "string",
      label: "Bullets",
      description: "Apply a bullet or numbering preset to the paragraphs, or `NONE` to strip existing bullets. `BULLET_*` presets are unordered, `NUMBERED_*` are ordered.",
      options: [
        BULLETS_NONE,
        ...BULLET_PRESETS,
      ],
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
      alignment,
      lineSpacing,
      spaceAbove,
      spaceBelow,
      indentStart,
      indentEnd,
      indentFirstLine,
      direction,
      spacingMode,
      bullets,
    } = this;

    const builder = utils.styleBuilder();

    builder.set("alignment", alignment);
    builder.set("lineSpacing", lineSpacing);
    builder.setDimension("spaceAbove", spaceAbove);
    builder.setDimension("spaceBelow", spaceBelow);
    builder.setDimension("indentStart", indentStart);
    builder.setDimension("indentEnd", indentEnd);
    builder.setDimension("indentFirstLine", indentFirstLine);
    builder.set("direction", direction);
    builder.set("spacingMode", spacingMode);

    if (builder.isEmpty && !bullets) {
      throw new ConfigurationError("Provide at least one formatting option (for example Alignment, Line Spacing, or Bullets).");
    }
    if ((rowIndex == null) !== (columnIndex == null)) {
      throw new ConfigurationError("Table Row Index and Table Column Index must be provided together.");
    }

    const textRange = utils.buildTextRange(startIndex, endIndex);
    const cellLocation = rowIndex != null
      ? {
        cellLocation: {
          rowIndex,
          columnIndex,
        },
      }
      : {};

    const requests = [];
    if (builder.fields.length) {
      requests.push({
        updateParagraphStyle: {
          objectId,
          style: builder.style,
          textRange,
          fields: builder.mask,
          ...cellLocation,
        },
      });
    }
    if (bullets === BULLETS_NONE) {
      requests.push({
        deleteParagraphBullets: {
          objectId,
          textRange,
          ...cellLocation,
        },
      });
    } else if (bullets) {
      requests.push({
        createParagraphBullets: {
          objectId,
          textRange,
          bulletPreset: bullets,
          ...cellLocation,
        },
      });
    }

    await googleSlides.batchUpdate(googleSlides.getPresentationId(presentationId), requests);

    $.export("$summary", `Formatted paragraphs on element ${objectId}`);

    return {
      presentationId,
      objectId,
      fieldsUpdated: builder.fields,
      requestsApplied: requests.map((request) => Object.keys(request)[0]),
    };
  },
};
