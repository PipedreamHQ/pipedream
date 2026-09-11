import googleSheets from "../../google_sheets.app.mjs";
import {
  colorToHex,
  getSheetProperties,
  parseA1Range,
  parseColor,
} from "../../common/format-utils.mjs";

/**
 * Turn a column or row spec into the API's half-open dimension range.
 * Accepts `A`, `A:F`, `3`, `2:5` — the same A1 vocabulary the rest of the tools use.
 */
function parseDimensionSpec(spec, dimension) {
  const parsed = parseA1Range(spec);
  const startKey = dimension === "COLUMNS"
    ? "startColumnIndex"
    : "startRowIndex";
  const endKey = dimension === "COLUMNS"
    ? "endColumnIndex"
    : "endRowIndex";

  if (parsed[startKey] == null) {
    throw new Error(
      `"${spec}" is not a valid ${dimension === "COLUMNS"
        ? "column"
        : "row"} reference. Use `
      + (dimension === "COLUMNS"
        ? "`A`, `A:F`, or `C:E`."
        : "`1`, `2:5`."),
    );
  }

  return {
    startIndex: parsed[startKey],
    endIndex: parsed[endKey],
  };
}

function parseSizeMap(json, propName) {
  let parsed;
  try {
    parsed = typeof json === "string"
      ? JSON.parse(json)
      : json;
  } catch {
    throw new Error(
      `${propName} must be a JSON object, e.g. `
      + (propName === "columnWidths"
        ? "`{\"A\": 240, \"C:E\": 120}`."
        : "`{\"1\": 40}`."),
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${propName} must be a JSON object mapping references to pixel sizes.`);
  }
  return parsed;
}

export default {
  key: "google_sheets-format-worksheet",
  name: "Format Worksheet",
  description:
    "Change worksheet-level layout in Google Sheets: freeze header rows or"
    + " columns, auto-resize columns to fit their contents, set explicit column"
    + " widths or row heights, hide gridlines, color the sheet tab, or rename"
    + " the worksheet."
    + " Use this when a user asks to freeze/lock a header row, make columns"
    + " wide enough to read, widen or narrow a column, or tidy up a sheet they"
    + " just uploaded or imported."
    + " `autoResizeColumns` is usually what fixes an imported sheet where"
    + " columns are too narrow and numbers show as `####`."
    + " To style the cells themselves (bold, colors, number formats), use"
    + " **Format Cells**. Use **Get Spreadsheet Info** to discover worksheet"
    + " names."
    + " Example: to lock the header row and fit every column to its content on"
    + " a freshly imported sheet, call with sheetName=\"Q3 Revenue\","
    + " freezeRows=1, autoResizeColumns=\"ALL\" → returns the layout changes"
    + " applied plus a link to the worksheet."
    + " [See the documentation](https://developers.google.com/workspace/sheets/api/samples/rowcolumn)",
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
    freezeRows: {
      type: "integer",
      label: "Freeze Rows",
      description: "Number of rows to freeze at the top so they stay visible"
        + " while scrolling. Use `1` to freeze a single header row, `0` to"
        + " unfreeze.",
      optional: true,
    },
    freezeColumns: {
      type: "integer",
      label: "Freeze Columns",
      description: "Number of columns to freeze at the left. Use `1` to keep"
        + " a label column visible while scrolling right, `0` to unfreeze.",
      optional: true,
    },
    autoResizeColumns: {
      type: "string",
      label: "Auto-Resize Columns",
      description: "Resize columns to fit their widest value. Pass `ALL` for"
        + " every column, or a column reference like `A:F` or `C` to limit it."
        + " This is the fastest fix for an imported sheet whose columns are too"
        + " narrow.",
      optional: true,
    },
    columnWidths: {
      type: "string",
      label: "Column Widths",
      description: "JSON object mapping column references to widths in pixels,"
        + " e.g. `{\"A\": 240, \"C:E\": 120}`. Use this instead of"
        + " `autoResizeColumns` when a specific width is wanted.",
      optional: true,
    },
    rowHeights: {
      type: "string",
      label: "Row Heights",
      description: "JSON object mapping row references to heights in pixels,"
        + " e.g. `{\"1\": 40, \"2:10\": 24}`.",
      optional: true,
    },
    hideGridlines: {
      type: "boolean",
      label: "Hide Gridlines",
      description: "Set `true` to hide the worksheet's gridlines (a common"
        + " finishing touch on a report), `false` to show them.",
      optional: true,
    },
    tabColor: {
      type: "string",
      label: "Tab Color",
      description: "Color of the worksheet tab, as a hex code (`#1155cc`) or a"
        + " common color name (`dark blue`, `green`).",
      optional: true,
    },
    newSheetName: {
      type: "string",
      label: "New Worksheet Name",
      description: "Rename the worksheet to this. Leave empty to keep the"
        + " current name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spreadsheetId,
      sheetName,
      freezeRows,
      freezeColumns,
      autoResizeColumns,
      columnWidths,
      rowHeights,
      hideGridlines,
      tabColor,
      newSheetName,
    } = this;

    const sheetProps = await getSheetProperties(
      this.googleSheets,
      spreadsheetId,
      sheetName,
    );
    const sheetId = sheetProps.sheetId;

    const requests = [];
    const applied = {};

    // All of the sheet-properties changes collapse into one request with a single
    // field mask, so unnamed properties (row/column counts, existing freezes) are
    // left untouched.
    const properties = {
      sheetId,
    };
    const propertyFields = [];

    if (freezeRows !== undefined && freezeRows !== null) {
      properties.gridProperties = {
        ...properties.gridProperties,
        frozenRowCount: freezeRows,
      };
      propertyFields.push("gridProperties.frozenRowCount");
      applied.freezeRows = freezeRows;
    }

    if (freezeColumns !== undefined && freezeColumns !== null) {
      properties.gridProperties = {
        ...properties.gridProperties,
        frozenColumnCount: freezeColumns,
      };
      propertyFields.push("gridProperties.frozenColumnCount");
      applied.freezeColumns = freezeColumns;
    }

    if (hideGridlines !== undefined && hideGridlines !== null) {
      properties.gridProperties = {
        ...properties.gridProperties,
        hideGridlines,
      };
      propertyFields.push("gridProperties.hideGridlines");
      applied.hideGridlines = hideGridlines;
    }

    const tab = parseColor(tabColor, "tabColor");
    if (tab) {
      properties.tabColorStyle = {
        rgbColor: tab,
      };
      propertyFields.push("tabColorStyle");
      applied.tabColor = colorToHex(tab);
    }

    if (newSheetName) {
      properties.title = newSheetName;
      propertyFields.push("title");
      applied.newSheetName = newSheetName;
    }

    if (propertyFields.length) {
      requests.push({
        updateSheetProperties: {
          properties,
          fields: propertyFields.join(","),
        },
      });
    }

    if (autoResizeColumns) {
      const dimensions = String(autoResizeColumns).trim()
        .toUpperCase() === "ALL"
        ? {
          sheetId,
          dimension: "COLUMNS",
          startIndex: 0,
          endIndex: sheetProps.gridProperties?.columnCount ?? 26,
        }
        : {
          sheetId,
          dimension: "COLUMNS",
          ...parseDimensionSpec(autoResizeColumns, "COLUMNS"),
        };
      requests.push({
        autoResizeDimensions: {
          dimensions,
        },
      });
      applied.autoResizeColumns = autoResizeColumns;
    }

    if (columnWidths) {
      const widths = parseSizeMap(columnWidths, "columnWidths");
      applied.columnWidths = {};
      for (const [
        ref,
        pixels,
      ] of Object.entries(widths)) {
        requests.push({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "COLUMNS",
              ...parseDimensionSpec(ref, "COLUMNS"),
            },
            properties: {
              pixelSize: Number(pixels),
            },
            fields: "pixelSize",
          },
        });
        applied.columnWidths[ref] = Number(pixels);
      }
    }

    if (rowHeights) {
      const heights = parseSizeMap(rowHeights, "rowHeights");
      applied.rowHeights = {};
      for (const [
        ref,
        pixels,
      ] of Object.entries(heights)) {
        requests.push({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "ROWS",
              ...parseDimensionSpec(ref, "ROWS"),
            },
            properties: {
              pixelSize: Number(pixels),
            },
            fields: "pixelSize",
          },
        });
        applied.rowHeights[ref] = Number(pixels);
      }
    }

    if (!requests.length) {
      throw new Error(
        "No layout options were provided. Pass at least one of: freezeRows,"
        + " freezeColumns, autoResizeColumns, columnWidths, rowHeights,"
        + " hideGridlines, tabColor, or newSheetName.",
      );
    }

    await this.googleSheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    const changes = Object.keys(applied);
    $.export(
      "$summary",
      `Updated layout of "${newSheetName ?? sheetName}" (${changes.join(", ")})`,
    );

    return {
      spreadsheetId,
      sheetName: newSheetName ?? sheetName,
      applied,
      spreadsheetUrl:
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
    };
  },
};
