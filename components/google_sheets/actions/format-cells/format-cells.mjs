import googleSheets from "../../google_sheets.app.mjs";
import {
  BORDER_PRESET_OPTIONS,
  BORDER_STYLE_OPTIONS,
  buildBordersRequest,
  colorToHex,
  getSheetProperties,
  gridRangeToA1,
  NUMBER_FORMAT_OPTIONS,
  parseA1Range,
  parseColor,
  resolveNumberFormat,
} from "../../common/format-utils.mjs";

const MERGE_OPTIONS = [
  "MERGE_ALL",
  "MERGE_COLUMNS",
  "MERGE_ROWS",
  "UNMERGE",
];

export default {
  key: "google_sheets-format-cells",
  name: "Format Cells",
  description:
    "Apply formatting to a range of cells in a Google Sheets worksheet:"
    + " bold/italic/underline, font size and family, text and background color,"
    + " alignment, text wrapping, number formats (currency, percent, date),"
    + " borders, and cell merging."
    + " Use this whenever a user asks to style, highlight, bold, color,"
    + " align, wrap, merge, or number-format cells — including making a header"
    + " row stand out. To change cell *values* instead, use **Update Multiple"
    + " Rows**; to freeze rows or resize columns, use **Format Worksheet**;"
    + " to style cells based on their contents, use **Add Conditional"
    + " Formatting**."
    + " Use **Get Spreadsheet Info** to discover worksheet names, and **Read"
    + " Rows** to see which cells hold the data you want to format."
    + " Colors accept a hex code (`#1a73e8`, `#fff`) or a common name"
    + " (`light gray`, `dark blue`, `yellow`). `range` is A1 notation WITHOUT"
    + " the worksheet name — `A1:F1` (a block), `B:B` (a whole column),"
    + " `2:2` (a whole row), or `A1` (one cell)."
    + " Only the attributes you pass are changed; everything else in the range"
    + " keeps its current formatting."
    + " Example: to make the header row of a 6-column sheet bold, white on dark"
    + " blue, and centered, call with sheetName=\"Financials\","
    + " range=\"A1:F1\", bold=true, textColor=\"#ffffff\","
    + " backgroundColor=\"#1155cc\", horizontalAlignment=\"CENTER\" → returns"
    + " the applied attributes plus a link to the worksheet."
    + " [See the documentation](https://developers.google.com/workspace/sheets/api/samples/formatting)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleSheets,
    spreadsheetId: {
      type: "string",
      label: "Spreadsheet ID",
      description: "The spreadsheet ID from the Google Sheets URL."
        + " Use **List Spreadsheets** to find it by name.",
    },
    sheetName: {
      type: "string",
      label: "Worksheet Name",
      description: "The worksheet (tab) name. Use **Get Spreadsheet Info**"
        + " to discover worksheet names.",
    },
    range: {
      type: "string",
      label: "Range",
      description: "The cells to format, in A1 notation and WITHOUT the"
        + " worksheet name. Examples: `A1:F1` (header row of 6 columns),"
        + " `B2:B100` (a block), `B:B` (an entire column), `3:3` (an entire"
        + " row), `A1` (a single cell).",
    },
    bold: {
      type: "boolean",
      label: "Bold",
      description: "Set `true` to bold the text, `false` to un-bold it."
        + " Omit to leave boldness unchanged.",
      optional: true,
    },
    italic: {
      type: "boolean",
      label: "Italic",
      description: "Set `true` to italicize, `false` to remove italics."
        + " Omit to leave unchanged.",
      optional: true,
    },
    underline: {
      type: "boolean",
      label: "Underline",
      description: "Set `true` to underline, `false` to remove the underline."
        + " Omit to leave unchanged.",
      optional: true,
    },
    strikethrough: {
      type: "boolean",
      label: "Strikethrough",
      description: "Set `true` to strike through the text, `false` to remove"
        + " it. Omit to leave unchanged.",
      optional: true,
    },
    fontSize: {
      type: "integer",
      label: "Font Size",
      description: "Font size in points, e.g. `11` for body text or `14` for a"
        + " title.",
      optional: true,
    },
    fontFamily: {
      type: "string",
      label: "Font Family",
      description: "Font family name as it appears in the Google Sheets font"
        + " menu, e.g. `Arial`, `Roboto`, `Courier New`.",
      optional: true,
    },
    textColor: {
      type: "string",
      label: "Text Color",
      description: "Font color as a hex code (`#ffffff`) or a common color"
        + " name (`dark blue`, `red`, `white`).",
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "Cell fill color as a hex code (`#d9d9d9`) or a common"
        + " color name (`light gray`, `light yellow`). This is the usual way to"
        + " highlight cells or shade a header row.",
      optional: true,
    },
    horizontalAlignment: {
      type: "string",
      label: "Horizontal Alignment",
      description: "Horizontal text alignment within each cell.",
      options: [
        "LEFT",
        "CENTER",
        "RIGHT",
      ],
      optional: true,
    },
    verticalAlignment: {
      type: "string",
      label: "Vertical Alignment",
      description: "Vertical text alignment within each cell.",
      options: [
        "TOP",
        "MIDDLE",
        "BOTTOM",
      ],
      optional: true,
    },
    wrapStrategy: {
      type: "string",
      label: "Wrap Strategy",
      description: "How text behaves when it is wider than the cell."
        + " `WRAP` shows it on multiple lines (and grows the row height),"
        + " `CLIP` cuts it off at the cell edge, `OVERFLOW_CELL` lets it spill"
        + " into empty neighboring cells.",
      options: [
        "WRAP",
        "CLIP",
        "OVERFLOW_CELL",
      ],
      optional: true,
    },
    numberFormat: {
      type: "string",
      label: "Number Format",
      description: "How numbers, dates and times in the range are displayed."
        + " Pick a named preset — e.g. `currency_usd` shows `1234.5` as"
        + " `$1,234.50`, `percent` shows `0.42` as `42%`, `date` shows a date"
        + " as `2026-09-10`, `plain_text` stops Sheets from auto-converting"
        + " entries like `1-2` into dates, and `automatic` resets to the"
        + " default. For a format not listed here, use `numberFormatPattern`.",
      options: NUMBER_FORMAT_OPTIONS,
      optional: true,
    },
    numberFormatPattern: {
      type: "string",
      label: "Number Format Pattern",
      description: "A custom Google Sheets number-format pattern, for formats"
        + " the `numberFormat` presets don't cover — e.g. `0.000`,"
        + " `#,##0 \"units\"`, `mmm d, yyyy`. Overrides `numberFormat` when"
        + " both are given.",
      optional: true,
    },
    borders: {
      type: "string",
      label: "Borders",
      description: "Which edges to draw borders on. `ALL` borders every cell"
        + " in the range, `OUTER` draws only the outside edge, `INNER` only the"
        + " lines between cells, `NONE` removes all borders in the range.",
      options: BORDER_PRESET_OPTIONS,
      optional: true,
    },
    borderStyle: {
      type: "string",
      label: "Border Style",
      description: "Line style for the borders. Defaults to `SOLID`. Ignored"
        + " when `borders` is `NONE`.",
      options: BORDER_STYLE_OPTIONS,
      optional: true,
    },
    borderColor: {
      type: "string",
      label: "Border Color",
      description: "Border color as a hex code or common name. Defaults to"
        + " black.",
      optional: true,
    },
    merge: {
      type: "string",
      label: "Merge",
      description: "Merge or unmerge the range — typically for a title banner"
        + " spanning several columns. `MERGE_ALL` makes the whole range one"
        + " cell, `MERGE_COLUMNS` merges each column vertically,"
        + " `MERGE_ROWS` merges each row horizontally, `UNMERGE` splits"
        + " previously merged cells back apart. Merging needs a bounded range"
        + " (`A1:F1`), not an open-ended one (`A:F`).",
      options: MERGE_OPTIONS,
      optional: true,
    },
    clearFormatting: {
      type: "boolean",
      label: "Clear Formatting",
      description: "Set `true` to reset the range to default formatting"
        + " (removes bold, colors, borders and number formats). Applied before"
        + " any other options in the same call, so you can clear and restyle"
        + " in one step.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spreadsheetId,
      sheetName,
      range: rangeInput,
      bold,
      italic,
      underline,
      strikethrough,
      fontSize,
      fontFamily,
      textColor,
      backgroundColor,
      horizontalAlignment,
      verticalAlignment,
      wrapStrategy,
      numberFormat,
      numberFormatPattern,
      borders,
      borderStyle,
      borderColor,
      merge,
      clearFormatting,
    } = this;

    const sheetProps = await getSheetProperties(
      this.googleSheets,
      spreadsheetId,
      sheetName,
    );
    const gridRange = {
      sheetId: sheetProps.sheetId,
      ...parseA1Range(rangeInput),
    };
    const a1 = gridRangeToA1(gridRange);

    const requests = [];
    const applied = {};

    // Clearing goes first so a single call can reset and then restyle.
    if (clearFormatting) {
      requests.push({
        repeatCell: {
          range: gridRange,
          cell: {},
          fields: "userEnteredFormat",
        },
      });
      applied.clearedFormatting = true;
    }

    // Build the cell format and its field mask together. The mask is what makes
    // this non-destructive: the API only overwrites paths named in `fields`, so an
    // unset prop leaves that attribute exactly as it was.
    const userEnteredFormat = {};
    const textFormat = {};
    const fields = [];

    const setText = (key, value, appliedValue = value) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      textFormat[key] = value;
      fields.push(`userEnteredFormat.textFormat.${key}`);
      applied[key] = appliedValue;
    };

    setText("bold", bold);
    setText("italic", italic);
    setText("underline", underline);
    setText("strikethrough", strikethrough);
    setText("fontSize", fontSize);
    setText("fontFamily", fontFamily);

    const foregroundColor = parseColor(textColor, "textColor");
    if (foregroundColor) {
      textFormat.foregroundColor = foregroundColor;
      fields.push("userEnteredFormat.textFormat.foregroundColor");
      applied.textColor = colorToHex(foregroundColor);
    }

    if (Object.keys(textFormat).length) {
      userEnteredFormat.textFormat = textFormat;
    }

    const fillColor = parseColor(backgroundColor, "backgroundColor");
    if (fillColor) {
      userEnteredFormat.backgroundColor = fillColor;
      fields.push("userEnteredFormat.backgroundColor");
      applied.backgroundColor = colorToHex(fillColor);
    }

    if (horizontalAlignment) {
      userEnteredFormat.horizontalAlignment = horizontalAlignment;
      fields.push("userEnteredFormat.horizontalAlignment");
      applied.horizontalAlignment = horizontalAlignment;
    }

    if (verticalAlignment) {
      userEnteredFormat.verticalAlignment = verticalAlignment;
      fields.push("userEnteredFormat.verticalAlignment");
      applied.verticalAlignment = verticalAlignment;
    }

    if (wrapStrategy) {
      userEnteredFormat.wrapStrategy = wrapStrategy;
      fields.push("userEnteredFormat.wrapStrategy");
      applied.wrapStrategy = wrapStrategy;
    }

    if (numberFormat || numberFormatPattern) {
      const resolved = resolveNumberFormat(numberFormat, numberFormatPattern);
      // `automatic` resolves to null: naming the field while omitting the value is
      // how the API resets a number format to the sheet default.
      if (resolved) {
        userEnteredFormat.numberFormat = resolved;
        applied.numberFormat = numberFormatPattern ?? numberFormat;
        applied.numberFormatPattern = resolved.pattern;
      } else {
        applied.numberFormat = "automatic";
      }
      fields.push("userEnteredFormat.numberFormat");
    }

    if (fields.length) {
      requests.push({
        repeatCell: {
          range: gridRange,
          cell: {
            userEnteredFormat,
          },
          fields: fields.join(","),
        },
      });
    }

    if (borders) {
      requests.push({
        updateBorders: buildBordersRequest(
          gridRange,
          borders,
          borderStyle ?? "SOLID",
          parseColor(borderColor, "borderColor"),
        ),
      });
      applied.borders = borders;
      if (borders !== "NONE") {
        applied.borderStyle = borderStyle ?? "SOLID";
      }
    }

    if (merge === "UNMERGE") {
      requests.push({
        unmergeCells: {
          range: gridRange,
        },
      });
      applied.merge = "UNMERGE";
    } else if (merge) {
      requests.push({
        mergeCells: {
          range: gridRange,
          mergeType: merge,
        },
      });
      applied.merge = merge;
    }

    if (!requests.length) {
      throw new Error(
        "No formatting options were provided. Pass at least one of: bold,"
        + " italic, underline, strikethrough, fontSize, fontFamily, textColor,"
        + " backgroundColor, horizontalAlignment, verticalAlignment,"
        + " wrapStrategy, numberFormat, numberFormatPattern, borders, merge,"
        + " or clearFormatting.",
      );
    }

    // One batchUpdate for every attribute, so the call cost is flat no matter how
    // much formatting was requested.
    await this.googleSheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    const attributes = Object.keys(applied);
    $.export(
      "$summary",
      `Formatted ${a1} on "${sheetName}" (${attributes.join(", ")})`,
    );

    return {
      spreadsheetId,
      sheetName,
      range: a1,
      applied,
      spreadsheetUrl:
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
        + `#gid=${sheetProps.sheetId}`,
    };
  },
};
