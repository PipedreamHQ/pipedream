/**
 * @typedef {string} ValueRenderOption - determines how values should be rendered in the output, as
 * defined by the [Google Sheets API docs](https://bit.ly/3oBEYJp)
 */

/**
 * @typedef {string} ValueInputOption - determines how input data should be interpreted, as
 * defined by the [Google Sheets API docs](https://bit.ly/3oCJcAl)
 */

/**
 * @typedef {string} InsertDataOption - determines how existing data is changed when new data is
 * input, as defined by the [Google Sheets API docs](https://bit.ly/3kGcmh6)
 */

/**
 * Values will be calculated & formatted in the reply according to the cell's formatting. Formatting
 * is based on the spreadsheet's locale, not the requesting user's locale.
 *
 * @type {ValueRenderOption}
 */
const GOOGLE_SHEETS_RENDER_FORMATTED_VALUE = "FORMATTED_VALUE";

/**
 * Values will be calculated, but not formatted in the reply.
 *
 * @type {ValueRenderOption}
 */
const GOOGLE_SHEETS_RENDER_UNFORMATTED_VALUE = "UNFORMATTED_VALUE";

/**
 * Values will not be calculated. The reply will include the formulas.
 *
 * @type {ValueRenderOption}
 */
const GOOGLE_SHEETS_RENDER_FORMULA = "FORMULA";

const VALUE_RENDER_OPTION = {
  FORMATTED_VALUE: GOOGLE_SHEETS_RENDER_FORMATTED_VALUE,
  UNFORMATTED_VALUE: GOOGLE_SHEETS_RENDER_UNFORMATTED_VALUE,
  FORMULA: GOOGLE_SHEETS_RENDER_FORMULA,
};

/**
 * Default input value. This value must not be used.
 *
 * @type {ValueInputOption}
 */
const GOOGLE_SHEETS_INPUT_INPUT_VALUE_OPTION_UNSPECIFIED = "INPUT_VALUE_OPTION_UNSPECIFIED";

/**
 * The values the user has entered will not be parsed and will be stored as-is.
 *
 * @type {ValueInputOption}
 */
const GOOGLE_SHEETS_INPUT_RAW = "RAW";

/**
 * The values will be parsed as if the user typed them into the UI. Numbers will stay as numbers,
 * but strings may be converted to numbers, dates, etc. following the same rules that are applied
 * when entering text into a cell via the Google Sheets UI.
 *
 * @type {ValueInputOption}
 */
const GOOGLE_SHEETS_INPUT_USER_ENTERED = "USER_ENTERED";

const VALUE_INPUT_OPTION = {
  INPUT_VALUE_OPTION_UNSPECIFIED: GOOGLE_SHEETS_INPUT_INPUT_VALUE_OPTION_UNSPECIFIED,
  RAW: GOOGLE_SHEETS_INPUT_RAW,
  USER_ENTERED: GOOGLE_SHEETS_INPUT_USER_ENTERED,
};

/**
 * Values will be calculated & formatted in the reply according to the cell's formatting. Formatting
 * is based on the spreadsheet's locale, not the requesting user's locale.
 *
 * @type {InsertDataOption}
 */
const GOOGLE_SHEETS_DATA_OVERWRITE = "OVERWRITE";

/**
 * Rows are inserted for the new data
 *
 * @type {InsertDataOption}
 */
const GOOGLE_SHEETS_DATA_INSERT_ROWS = "INSERT_ROWS";

const INSERT_DATA_OPTION = {
  OVERWRITE: GOOGLE_SHEETS_DATA_OVERWRITE,
  INSERT_ROWS: GOOGLE_SHEETS_DATA_INSERT_ROWS,
};

const BORDER_STYLES = [
  "DOTTED",
  "DASHED",
  "SOLID",
  "SOLID_MEDIUM",
  "SOLID_THICK",
  "NONE",
  "DOUBLE",
];

const HORIZONTAL_ALIGNMENTS = [
  "LEFT",
  "CENTER",
  "RIGHT",
];

export {
  VALUE_RENDER_OPTION,
  VALUE_INPUT_OPTION,
  INSERT_DATA_OPTION,
  BORDER_STYLES,
  HORIZONTAL_ALIGNMENTS,
};
