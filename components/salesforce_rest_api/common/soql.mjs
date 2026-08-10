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
  if (constants.DATE_ONLY_REGEX.test(raw)) {
    return `${raw}T00:00:00Z`;
  }
  if (constants.DATE_TIME_REGEX.test(raw)) {
    return raw;
  }
  throw new ConfigurationError(`**${label}** must be an ISO 8601 date (\`2026-08-01\`) or date-time (\`2026-08-01T00:00:00Z\`)`);
}
