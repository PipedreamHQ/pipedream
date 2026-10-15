import googleSheets from "../../google_sheets.app.mjs";
import {
  clampRange,
  colorToHex,
  getSheetProperties,
  gridRangeToA1,
  indexToColumn,
  parseA1Range,
} from "../../common/format-utils.mjs";

/**
 * Google resolves every cell's `effectiveFormat`, so an unstyled cell still reports a
 * font, a size and white-on-black colors. Echoing all of that back would bury the two
 * attributes the caller actually asked about, so defaults are omitted and only
 * deliberate formatting is reported.
 */
const DEFAULTS = {
  fontFamily: "Arial",
  fontSize: 10,
  textColor: "#000000",
  backgroundColor: "#ffffff",
  wrapStrategy: "OVERFLOW_CELL",
};

const MAX_CELLS = 500;

function describeCell(cellRef, cell) {
  const format = cell?.effectiveFormat ?? {};
  const text = format.textFormat ?? {};
  const out = {
    cell: cellRef,
  };

  if (cell?.formattedValue !== undefined) {
    out.value = cell.formattedValue;
  }

  for (const flag of [
    "bold",
    "italic",
    "underline",
    "strikethrough",
  ]) {
    if (text[flag]) {
      out[flag] = true;
    }
  }

  if (text.fontSize != null && text.fontSize !== DEFAULTS.fontSize) {
    out.fontSize = text.fontSize;
  }
  if (text.fontFamily && text.fontFamily !== DEFAULTS.fontFamily) {
    out.fontFamily = text.fontFamily;
  }

  const textColor = colorToHex(text.foregroundColor);
  if (textColor && textColor !== DEFAULTS.textColor) {
    out.textColor = textColor;
  }

  const backgroundColor = colorToHex(format.backgroundColor);
  if (backgroundColor && backgroundColor !== DEFAULTS.backgroundColor) {
    out.backgroundColor = backgroundColor;
  }

  if (format.horizontalAlignment) {
    out.horizontalAlignment = format.horizontalAlignment;
  }
  if (format.verticalAlignment) {
    out.verticalAlignment = format.verticalAlignment;
  }
  if (format.wrapStrategy && format.wrapStrategy !== DEFAULTS.wrapStrategy) {
    out.wrapStrategy = format.wrapStrategy;
  }

  if (format.numberFormat?.type) {
    out.numberFormat = format.numberFormat.type;
    if (format.numberFormat.pattern) {
      out.numberFormatPattern = format.numberFormat.pattern;
    }
  }

  const borders = format.borders ?? {};
  const borderSides = Object.entries(borders)
    .filter(([
      ,
      side,
    ]) => side?.style && side.style !== "NONE")
    .map(([
      name,
    ]) => name);
  if (borderSides.length) {
    out.borders = borderSides;
  }

  return out;
}

export default {
  key: "google_sheets-get-cell-formatting",
  name: "Get Cell Formatting",
  description:
    "Read the current formatting of a range of cells in Google Sheets — bold,"
    + " italic, font size and family, text and background colors (as hex),"
    + " alignment, wrapping, number formats and borders — plus worksheet-level"
    + " layout (frozen rows/columns, merged ranges, hidden gridlines)."
    + " Use this to answer questions about how a sheet looks ('is the header"
    + " row bold?', 'what format is column C?', 'is the top row frozen?'), to"
    + " check the result of a **Format Cells** or **Format Worksheet** call, or"
    + " to copy one range's styling onto another."
    + " To read cell *values* instead of their styling, use **Read Rows**."
    + " `range` is A1 notation WITHOUT the worksheet name (`A1:F1`, `C2:C50`)."
    + " Attributes left at their Google Sheets default are omitted from each"
    + " cell, so whatever comes back is formatting that was deliberately"
    + " applied."
    + " Example: to check how a header row is styled, call with"
    + " sheetName=\"Financials\", range=\"A1:F1\" → returns one entry per cell"
    + " such as `{cell: \"A1\", value: \"Region\", bold: true,"
    + " backgroundColor: \"#1155cc\", textColor: \"#ffffff\","
    + " horizontalAlignment: \"CENTER\"}` alongside"
    + " `{frozenRowCount: 1, mergedRanges: []}`."
    + " [See the documentation](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The cells to inspect, in A1 notation and WITHOUT the"
        + " worksheet name. Examples: `A1:F1` (a header row), `C2:C50`,"
        + " `B:B` (a whole column), `A1` (one cell). Keep the range tight —"
        + `at most ${MAX_CELLS} cells are described per call.`,
    },
    includeCellDetail: {
      type: "boolean",
      label: "Include Cell Detail",
      description: "Whether to return per-cell formatting. Default `true`."
        + " Set `false` for just the worksheet-level summary (frozen rows,"
        + " merged ranges, gridlines, and the distinct number formats in the"
        + " range) — much smaller, and enough to answer 'is this sheet"
        + " formatted?' over a large range.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const {
      spreadsheetId,
      sheetName,
      range: rangeInput,
      includeCellDetail,
    } = this;

    const sheetProps = await getSheetProperties(
      this.googleSheets,
      spreadsheetId,
      sheetName,
    );

    // A whole-column range like `B:B` is unbounded, which would ask the API to
    // describe every row of the grid. Clamp to the sheet's real size and the cell cap.
    const {
      range: gridRange,
      truncated,
    } = clampRange(parseA1Range(rangeInput), sheetProps, MAX_CELLS);

    const escaped = sheetName.replace(/'/g, "''");
    const a1 = gridRangeToA1(gridRange);
    const fullRange = `'${escaped}'!${a1}`;

    const spreadsheet = await this.googleSheets.getSpreadsheet(
      spreadsheetId,
      [
        "sheets(properties(sheetId,title,gridProperties),merges,"
        + "data(startRow,startColumn,rowData(values(formattedValue,effectiveFormat))))",
      ],
      {
        ranges: [
          fullRange,
        ],
        includeGridData: includeCellDetail !== false,
      },
    );

    const sheet = spreadsheet.sheets?.find(
      ({ properties }) => properties?.sheetId === sheetProps.sheetId,
    ) ?? spreadsheet.sheets?.[0];

    const grid = sheet?.properties?.gridProperties ?? {};
    const worksheet = {
      sheetName: sheet?.properties?.title ?? sheetName,
      frozenRowCount: grid.frozenRowCount ?? 0,
      frozenColumnCount: grid.frozenColumnCount ?? 0,
      hideGridlines: grid.hideGridlines ?? false,
      mergedRanges: (sheet?.merges ?? []).map(gridRangeToA1),
    };

    if (includeCellDetail === false) {
      $.export(
        "$summary",
        `Read worksheet formatting summary for "${sheetName}"`,
      );
      return {
        spreadsheetId,
        range: a1,
        worksheet,
      };
    }

    const data = sheet?.data?.[0] ?? {};
    const startRow = data.startRow ?? gridRange.startRowIndex ?? 0;
    const startColumn = data.startColumn ?? gridRange.startColumnIndex ?? 0;

    const cells = [];
    (data.rowData ?? []).forEach((row, rowOffset) => {
      (row.values ?? []).forEach((cell, colOffset) => {
        const ref = `${indexToColumn(startColumn + colOffset)}${startRow + rowOffset + 1}`;
        cells.push(describeCell(ref, cell));
      });
    });

    const numberFormats = [
      ...new Set(cells.map(({ numberFormatPattern }) => numberFormatPattern)
        .filter(Boolean)),
    ];

    $.export(
      "$summary",
      `Read formatting for ${cells.length} cell${cells.length === 1
        ? ""
        : "s"} in ${a1} on "${sheetName}"`,
    );

    return {
      spreadsheetId,
      range: a1,
      cellCount: cells.length,
      ...truncated && {
        truncated: true,
        truncationNote:
          `The requested range was larger than ${MAX_CELLS} cells and was`
          + ` clamped to ${a1}. Request a narrower range to see the rest.`,
      },
      worksheet,
      numberFormats,
      cells,
      spreadsheetUrl:
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
        + `#gid=${sheetProps.sheetId}`,
    };
  },
};
