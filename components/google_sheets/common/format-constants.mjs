/**
 * The vocabulary the AI-optimized Google Sheets formatting tools speak: color
 * names, number-format presets and border presets, plus the option lists their
 * props advertise. `format-utils.mjs` holds the functions that translate these
 * into the Sheets API's own shapes.
 *
 * Deliberately NOT in `constants.mjs`: that file is imported by
 * `google_sheets.app.mjs`, so every component in the app bundles it and a change
 * there requires a version bump on all of them. These tables are used by the four
 * formatting actions alone, and this file keeps the coupling that narrow.
 */

import { BORDER_STYLES } from "./constants.mjs";

/**
 * Token of an A1 cell reference: optional column letters, optional row number.
 * `A1`, `AA`, `12` all match; the parser rejects a token that matches neither half.
 */
const CELL_TOKEN = /^([A-Za-z]*)(\d*)$/;

/**
 * A small set of CSS-ish color names, so "light gray" works as well as "#d9d9d9".
 * Deliberately short: it covers what people actually ask for in a spreadsheet
 * (highlights, banded headers, red/amber/green status) rather than all 148 CSS names.
 */
const NAMED_COLORS = {
  "black": "#000000",
  "white": "#ffffff",
  "gray": "#999999",
  "grey": "#999999",
  "light gray": "#d9d9d9",
  "light grey": "#d9d9d9",
  "dark gray": "#666666",
  "dark grey": "#666666",
  "red": "#e06666",
  "light red": "#f4cccc",
  "dark red": "#cc0000",
  "orange": "#f6b26b",
  "light orange": "#fce5cd",
  "yellow": "#ffd966",
  "light yellow": "#fff2cc",
  "green": "#93c47d",
  "light green": "#d9ead3",
  "dark green": "#38761d",
  "blue": "#6d9eeb",
  "light blue": "#cfe2f3",
  "dark blue": "#1155cc",
  "purple": "#8e7cc3",
  "light purple": "#d9d2e9",
  "magenta": "#c27ba0",
  "pink": "#ead1dc",
  "cyan": "#76a5af",
  "teal": "#76a5af",
  "brown": "#b45f06",
};

/**
 * Named number-format presets. An agent asked to "format as currency" should not
 * have to know Google wants `"$#,##0.00"`; `numberFormatPattern` remains the escape
 * hatch for anything not covered here.
 *
 * `automatic` is intentionally `null` — clearing the format means naming it in the
 * field mask while omitting it from the cell, which resets it to the sheet default.
 */
const NUMBER_FORMATS = {
  automatic: null,
  currency_usd: {
    type: "CURRENCY",
    pattern: "\"$\"#,##0.00",
  },
  currency_usd_whole: {
    type: "CURRENCY",
    pattern: "\"$\"#,##0",
  },
  currency_eur: {
    type: "CURRENCY",
    pattern: "\"€\"#,##0.00",
  },
  currency_gbp: {
    type: "CURRENCY",
    pattern: "\"£\"#,##0.00",
  },
  percent: {
    type: "PERCENT",
    pattern: "0%",
  },
  percent_1dp: {
    type: "PERCENT",
    pattern: "0.0%",
  },
  percent_2dp: {
    type: "PERCENT",
    pattern: "0.00%",
  },
  number_2dp: {
    type: "NUMBER",
    pattern: "#,##0.00",
  },
  integer_comma: {
    type: "NUMBER",
    pattern: "#,##0",
  },
  date: {
    type: "DATE",
    pattern: "yyyy-mm-dd",
  },
  date_us: {
    type: "DATE",
    pattern: "mm/dd/yyyy",
  },
  datetime: {
    type: "DATE_TIME",
    pattern: "yyyy-mm-dd hh:mm:ss",
  },
  time: {
    type: "TIME",
    pattern: "hh:mm:ss",
  },
  duration: {
    type: "TIME",
    pattern: "[h]:mm:ss",
  },
  scientific: {
    type: "SCIENTIFIC",
    pattern: "0.00E+00",
  },
  plain_text: {
    type: "TEXT",
    pattern: "@",
  },
};

const NUMBER_FORMAT_OPTIONS = Object.keys(NUMBER_FORMATS);

/** Which sides each `borders` preset writes. */
const BORDER_PRESETS = {
  ALL: [
    "top",
    "bottom",
    "left",
    "right",
    "innerHorizontal",
    "innerVertical",
  ],
  OUTER: [
    "top",
    "bottom",
    "left",
    "right",
  ],
  INNER: [
    "innerHorizontal",
    "innerVertical",
  ],
  TOP: [
    "top",
  ],
  BOTTOM: [
    "bottom",
  ],
  LEFT: [
    "left",
  ],
  RIGHT: [
    "right",
  ],
  INNER_HORIZONTAL: [
    "innerHorizontal",
  ],
  INNER_VERTICAL: [
    "innerVertical",
  ],
  NONE: [],
};

const BORDER_PRESET_OPTIONS = Object.keys(BORDER_PRESETS);

/**
 * Border styles the preset-driven `borders` prop accepts. `NONE` is omitted on
 * purpose: borders are cleared with the `NONE` *preset*, which writes style `NONE`
 * to every side, so offering it here as a style too would be two ways to say one
 * thing (and no way at all to say "clear only the top edge").
 */
const BORDER_STYLE_OPTIONS = BORDER_STYLES.filter((style) => style !== "NONE");

export {
  CELL_TOKEN,
  NAMED_COLORS,
  NUMBER_FORMATS,
  NUMBER_FORMAT_OPTIONS,
  BORDER_PRESETS,
  BORDER_PRESET_OPTIONS,
  BORDER_STYLE_OPTIONS,
};
