/** DateFormatOpt values that use compact dates without a delimiter (mmddyy, etc.). */
export const DATE_FORMATS_WITHOUT_DELIMITER = new Set([
  "D",
  "E",
  "F",
  "H",
]);

/**
 * When true, omit DateDelim from the request body (do not send "-" or user value).
 * @param {string|undefined|null} dateFormatOpt
 * @returns {boolean}
 */
export function shouldOmitDateDelim(dateFormatOpt) {
  const fmt = String(dateFormatOpt || "A").toUpperCase();
  return DATE_FORMATS_WITHOUT_DELIMITER.has(fmt);
}
