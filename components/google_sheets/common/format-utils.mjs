/**
 * Utilities for the AI-optimized Google Sheets formatting tools.
 *
 * These exist so an LLM can speak in the vocabulary a person uses — `#1a73e8` or
 * "light gray" instead of three floats in [0,1]; `currency_usd` instead of
 * `"$#,##0.00"`; `A1:F1` instead of a zero-based half-open GridRange — and so the
 * translation to the Sheets API happens in one tested place instead of once per action.
 *
 * The vocabulary itself (color names, number-format presets, border presets) lives in
 * `constants.mjs`; this file is the functions that translate it.
 */

import {
  BORDER_PRESETS,
  BORDER_PRESET_OPTIONS,
  CELL_TOKEN,
  NAMED_COLORS,
  NUMBER_FORMATS,
  NUMBER_FORMAT_OPTIONS,
} from "./constants.mjs";

/* ── A1 range parsing ─────────────────────────────────────────────────────── */

/**
 * Convert a column letter reference to a 0-based index.
 * Handles multi-letter columns: A→0, Z→25, AA→26, AB→27.
 * @param {string} letters - column letters, case-insensitive
 * @returns {number} 0-based column index
 */
export function columnToIndex(letters) {
  let sum = 0;
  for (const ch of letters.toUpperCase()) {
    sum = sum * 26 + (ch.charCodeAt(0) - 64);
  }
  return sum - 1;
}

/**
 * Convert a 0-based column index back to letters. 0→A, 26→AA.
 * @param {number} index - 0-based column index
 * @returns {string} column letters
 */
export function indexToColumn(index) {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function parseCellToken(token, original) {
  const match = CELL_TOKEN.exec(token.trim());
  if (!match || (!match[1] && !match[2])) {
    throw new Error(
      `Could not parse "${original}" as an A1 range. Use forms like `
      + "`A1` (one cell), `A1:F1` (a block), `B:B` (a whole column), "
      + "`2:2` (a whole row), or `AA1:AB5`.",
    );
  }
  return {
    col: match[1]
      ? columnToIndex(match[1])
      : null,
    row: match[2]
      ? parseInt(match[2], 10) - 1
      : null,
  };
}

/**
 * Parse an A1 notation range into a Sheets API GridRange (minus `sheetId`).
 *
 * The API's end indices are EXCLUSIVE and its start indices are 0-based, so `A1:F1`
 * becomes rows [0,1) and columns [0,6). An omitted bound means "unbounded in that
 * direction", which is how whole-column (`B:B`) and whole-row (`2:2`) ranges are
 * expressed. A worksheet prefix (`Sheet1!A1`) is tolerated and ignored — the caller
 * passes the worksheet separately.
 *
 * @param {string} rangeInput - A1 notation range
 * @returns {object} partial GridRange with only the bounds that are defined
 */
export function parseA1Range(rangeInput) {
  if (typeof rangeInput !== "string" || !rangeInput.trim()) {
    throw new Error("A range in A1 notation is required, e.g. `A1:F1`.");
  }

  const original = rangeInput.trim();
  // Tolerate (and drop) a worksheet prefix, and absolute-reference dollar signs.
  const bang = original.lastIndexOf("!");
  const bare = (bang === -1
    ? original
    : original.slice(bang + 1)
  ).replace(/\$/g, "").replace(/'/g, "")
    .trim();

  const parts = bare.split(":");
  if (parts.length > 2) {
    throw new Error(`Could not parse "${original}" as an A1 range: too many ":".`);
  }

  const start = parseCellToken(parts[0], original);
  const end = parts.length === 2
    ? parseCellToken(parts[1], original)
    : start;

  const range = {};

  /**
   * Assign one axis. Both bounds present is the normal case. Exactly one bound
   * present on a two-part range means "unbounded in the other direction" — `A2:F`
   * is everything from row 2 down, which is what an agent writes for "the data
   * rows below the header". A single-cell range has both bounds by definition.
   */
  const assignAxis = (startValue, endValue, startKey, endKey) => {
    const bounds = [
      startValue,
      endValue,
    ].filter((v) => v !== null);
    if (!bounds.length) {
      return false;
    }
    if (bounds.length === 2 || parts.length === 1) {
      range[startKey] = Math.min(...bounds);
      range[endKey] = Math.max(...bounds) + 1; // API end is exclusive
    } else if (startValue !== null) {
      range[startKey] = startValue; // open-ended below/right
    } else {
      range[endKey] = endValue + 1; // open-ended above/left
    }
    return true;
  };

  const hasRows = assignAxis(start.row, end.row, "startRowIndex", "endRowIndex");
  const hasCols = assignAxis(
    start.col,
    end.col,
    "startColumnIndex",
    "endColumnIndex",
  );

  if (!hasRows && !hasCols) {
    throw new Error(`Could not parse "${original}" as an A1 range.`);
  }

  return range;
}

/**
 * Render a GridRange back to A1 notation, for summaries and error messages.
 * @param {object} range - a GridRange (sheetId ignored)
 * @returns {string} A1 notation
 */
export function gridRangeToA1(range) {
  const startCol = range.startColumnIndex != null
    ? indexToColumn(range.startColumnIndex)
    : "";
  const endCol = range.endColumnIndex != null
    ? indexToColumn(range.endColumnIndex - 1)
    : "";
  const startRow = range.startRowIndex != null
    ? range.startRowIndex + 1
    : "";
  const endRow = range.endRowIndex != null
    ? range.endRowIndex
    : "";
  return `${startCol}${startRow}:${endCol}${endRow}`;
}

/* ── Colors ───────────────────────────────────────────────────────────────── */

/**
 * Parse a hex code or color name into the API's `{red, green, blue}` floats.
 * @param {string} input - `#RRGGBB`, `#RGB`, `RRGGBB`, or a name from NAMED_COLORS
 * @param {string} [propName="color"] - prop name, for the error message
 * @returns {object} Color object with red/green/blue in [0,1]
 */
export function parseColor(input, propName = "color") {
  if (input == null || input === "") {
    return undefined;
  }
  const raw = String(input).trim()
    .toLowerCase();
  const hex = NAMED_COLORS[raw] ?? raw;
  const cleaned = hex.replace(/^#/, "");

  const expanded = cleaned.length === 3
    ? cleaned.split("").map((c) => c + c)
      .join("")
    : cleaned;

  if (!/^[0-9a-f]{6}$/.test(expanded)) {
    throw new Error(
      `Could not parse "${input}" as a ${propName}. Pass a hex code `
      + "(`#1a73e8`, `#fff`) or one of: "
      + `${Object.keys(NAMED_COLORS).join(", ")}.`,
    );
  }

  return {
    red: parseInt(expanded.slice(0, 2), 16) / 255,
    green: parseInt(expanded.slice(2, 4), 16) / 255,
    blue: parseInt(expanded.slice(4, 6), 16) / 255,
  };
}

/**
 * Render an API Color back to a hex string, so read tools report colors in the same
 * vocabulary the write tools accept.
 * @param {object} color - Color object with optional red/green/blue in [0,1]
 * @returns {string|undefined} `#rrggbb`
 */
export function colorToHex(color) {
  if (!color || typeof color !== "object") {
    return undefined;
  }
  const channel = (v) => Math.round((v ?? 0) * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${channel(color.red)}${channel(color.green)}${channel(color.blue)}`;
}

/* ── Number formats ───────────────────────────────────────────────────────── */

/**
 * Resolve the `numberFormat` preset + optional custom pattern into an API
 * NumberFormat. A custom pattern always wins over the preset.
 * @param {string} [preset] - key from NUMBER_FORMATS
 * @param {string} [customPattern] - a raw Google number-format pattern
 * @returns {object|null|undefined} NumberFormat, `null` to clear, `undefined` if unset
 */
export function resolveNumberFormat(preset, customPattern) {
  if (customPattern) {
    const type = preset && NUMBER_FORMATS[preset]
      ? NUMBER_FORMATS[preset].type
      : "NUMBER";
    return {
      type,
      pattern: customPattern,
    };
  }
  if (!preset) {
    return undefined;
  }
  if (!(preset in NUMBER_FORMATS)) {
    throw new Error(
      `Unknown numberFormat "${preset}". Valid presets: `
      + `${NUMBER_FORMAT_OPTIONS.join(", ")}. `
      + "For anything else, pass a Google number-format pattern in "
      + "`numberFormatPattern` (e.g. `0.000` or `#,##0 \"units\"`).",
    );
  }
  return NUMBER_FORMATS[preset];
}

/* ── Borders ──────────────────────────────────────────────────────────────── */

/**
 * Build an `updateBorders` request body from the preset. `NONE` writes style `NONE`
 * to every side, which is how the API removes borders.
 * @param {object} range - GridRange including sheetId
 * @param {string} preset - key from BORDER_PRESETS
 * @param {string} [style="SOLID"] - a BORDER_STYLE_OPTIONS value
 * @param {object} [color] - API Color for the border
 * @returns {object} updateBorders request body
 */
export function buildBordersRequest(range, preset, style = "SOLID", color) {
  if (!(preset in BORDER_PRESETS)) {
    throw new Error(
      `Unknown borders value "${preset}". Valid: ${BORDER_PRESET_OPTIONS.join(", ")}.`,
    );
  }

  const sides = preset === "NONE"
    ? BORDER_PRESETS.ALL
    : BORDER_PRESETS[preset];

  const border = preset === "NONE"
    ? {
      style: "NONE",
    }
    : {
      style,
      ...color && {
        color,
      },
    };

  return sides.reduce((acc, side) => {
    acc[side] = border;
    return acc;
  }, {
    range,
  });
}

/* ── Sheet lookup ─────────────────────────────────────────────────────────── */

/**
 * Resolve a worksheet name to its full `properties` object (which carries the numeric
 * `sheetId` every formatting request needs).
 *
 * The app file's `_getSheetIdFromName` throws a bare "Sheet name not found", which an
 * agent can't recover from. This lists the names that DO exist, so the next call can
 * be right — the single highest-value error message in these tools, because
 * `sheetName` is the parameter an agent is most likely to guess wrong.
 *
 * @param {object} app - the google_sheets app instance
 * @param {string} spreadsheetId - the spreadsheet ID
 * @param {string} sheetName - the worksheet (tab) name
 * @returns {Promise<object>} the matching sheet's `properties`
 */
export async function getSheetProperties(app, spreadsheetId, sheetName) {
  const { sheets = [] } = await app.getSpreadsheet(spreadsheetId, [
    "sheets.properties",
  ]);

  const titles = sheets.map(({ properties }) => properties?.title);
  const match = sheets.find(({ properties }) => properties?.title === sheetName);

  if (!match) {
    const insensitive = sheets.find(({ properties }) =>
      properties?.title?.toLowerCase() === String(sheetName).toLowerCase());
    if (insensitive) {
      return insensitive.properties;
    }
    throw new Error(
      `Worksheet "${sheetName}" not found in this spreadsheet. `
      + `Available worksheets: ${titles.map((t) => `"${t}"`).join(", ")}. `
      + "Use **Get Spreadsheet Info** to list worksheets.",
    );
  }

  return match.properties;
}

/**
 * Clamp a GridRange to the worksheet's actual grid, so a whole-column range like
 * `B:B` doesn't ask the API to describe a million empty rows.
 * @param {object} range - a GridRange
 * @param {object} sheetProps - the sheet's `properties` (for gridProperties)
 * @param {number} [maxCells=2000] - hard cap on the cell count
 * @returns {object} `{range, truncated}` — the clamped range and whether the cap bit
 */
export function clampRange(range, sheetProps, maxCells = 2000) {
  const grid = sheetProps?.gridProperties ?? {};
  const rowCount = grid.rowCount ?? 1000;
  const columnCount = grid.columnCount ?? 26;

  const startRowIndex = range.startRowIndex ?? 0;
  const startColumnIndex = range.startColumnIndex ?? 0;
  let endRowIndex = Math.min(range.endRowIndex ?? rowCount, rowCount);
  let endColumnIndex = Math.min(range.endColumnIndex ?? columnCount, columnCount);

  let truncated = false;
  const width = Math.max(endColumnIndex - startColumnIndex, 1);
  const maxRows = Math.max(Math.floor(maxCells / width), 1);
  if (endRowIndex - startRowIndex > maxRows) {
    endRowIndex = startRowIndex + maxRows;
    truncated = true;
  }
  if ((endColumnIndex - startColumnIndex) * (endRowIndex - startRowIndex) > maxCells) {
    endColumnIndex = startColumnIndex
      + Math.max(Math.floor(maxCells / Math.max(endRowIndex - startRowIndex, 1)), 1);
    truncated = true;
  }

  return {
    range: {
      ...range,
      startRowIndex,
      startColumnIndex,
      endRowIndex,
      endColumnIndex,
    },
    truncated,
  };
}
