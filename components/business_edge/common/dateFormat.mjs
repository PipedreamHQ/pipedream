/** DateFormatOpt values that use compact dates without a delimiter (mmddyy, etc.). */
export const DATE_FORMATS_WITHOUT_DELIMITER = new Set([
  "D",
  "E",
  "F",
  "H",
]);

const ALLOWED_DATE_FORMAT_OPT = new Set([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
]);

/**
 * Trim, uppercase, validate A–H; empty input defaults to "A".
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeDateFormatOpt(raw) {
  const s = raw == null || raw === ""
    ? ""
    : String(raw)
      .trim()
      .toUpperCase();
  if (s === "") {
    return "A";
  }
  if (!ALLOWED_DATE_FORMAT_OPT.has(s)) {
    throw new Error(
      "DateFormatOpt must be a single letter A through H (after trim and "
      + `uppercase). Received: ${JSON.stringify(raw)}`,
    );
  }
  return s;
}

/**
 * When true, omit DateDelim from the request body (do not send "-" or user value).
 * @param {string|undefined|null} dateFormatOpt
 * @returns {boolean}
 */
export function shouldOmitDateDelim(dateFormatOpt) {
  const fmt = String(dateFormatOpt || "A").toUpperCase();
  return DATE_FORMATS_WITHOUT_DELIMITER.has(fmt);
}
