import { ConfigurationError } from "@pipedream/platform";
import constants from "./constants.mjs";

/**
 * Escapes a value for use inside a quoted SOQL string literal.
 * Salesforce escapes with a backslash, so the backslash itself must go first.
 */
export function escapeSoqlString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

/**
 * Validates a value that will be interpolated into SOQL as a record ID.
 * IDs are unquoted-adjacent, high-trust values, so a bad one is rejected up front
 * rather than escaped.
 */
export function assertSalesforceId(value, label) {
  if (!constants.SALESFORCE_ID_REGEX.test(value)) {
    throw new ConfigurationError(`**${label}** must be a 15- or 18-character Salesforce ID`);
  }
  return value;
}

/**
 * Builds a SELECT field list, always including Id so a caller that narrows the
 * fields to save context still gets the ID every follow-up action needs.
 */
export function buildFieldList(selected, fallback) {
  return [
    ...new Set([
      "Id",
      ...selected?.length
        ? selected
        : fallback,
    ]),
  ];
}

/**
 * Salesforce returns at most one batch per query and signals a partial result
 * with `done: false`. Callers that ignore it answer confidently from page one,
 * so say so in the summary instead.
 */
export function truncationNote({
  done, totalSize,
}, returned) {
  if (done !== false) {
    return "";
  }
  const total = totalSize
    ? ` of ${totalSize}`
    : "";
  return ` This is a partial result (${returned}${total} records) - narrow the filters, or use the **SOQL Query** action, which pages through every record.`;
}

/**
 * Normalizes a user-supplied date/datetime into a SOQL datetime literal.
 * SOQL datetime literals are NOT quoted, so the value must be strictly validated
 * instead of escaped. A date-only value is widened to the start of that day (UTC).
 */
export function toSoqlDateTimeLiteral(value, label) {
  const raw = String(value).trim();
  const shapeOk = constants.DATE_ONLY_REGEX.test(raw) || constants.DATE_TIME_REGEX.test(raw);
  if (!shapeOk) {
    throw new ConfigurationError(`**${label}** must be an ISO 8601 date (\`2026-08-01\`) or date-time (\`2026-08-01T00:00:00Z\`)`);
  }

  const literal = constants.DATE_ONLY_REGEX.test(raw)
    ? `${raw}T00:00:00Z`
    : raw;

  // The shape check alone accepts impossible values. Date.parse rejects month 13,
  // hour 25 and offset +99, but silently rolls 2026-02-31 over to March 3, so the
  // calendar day is round-tripped separately.
  const [
    year,
    month,
    day,
  ] = raw.slice(0, 10).split("-")
    .map(Number);
  // Date.UTC maps years 0-99 to 1900-1999, so building the date there first would
  // roll a valid leap day like `0000-02-29` into March (1900 is not a leap year) and
  // reject it. Setting all three parts together on an epoch date avoids that.
  const utc = new Date(0);
  utc.setUTCFullYear(year, month - 1, day);
  const dayIsReal = utc.getUTCFullYear() === year
    && utc.getUTCMonth() === month - 1
    && utc.getUTCDate() === day;

  if (!dayIsReal || Number.isNaN(Date.parse(literal))) {
    throw new ConfigurationError(`**${label}** is not a real date: \`${raw}\``);
  }
  return literal;
}
