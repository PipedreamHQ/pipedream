const MINOR_UNITS_PER_UNIT = 100;

/**
 * Renders a Brex money object as a human-readable amount for use in `$summary`.
 * Brex returns amounts in the currency's smallest denomination, so `700` is $7.00 in USD.
 *
 * @param {Object} [money] - A Brex money object, e.g. `{ amount: 700, currency: "USD" }`.
 * @returns {?string} The formatted amount, or `null` when no money object was provided.
 */
export function formatMoney(money) {
  if (!money) {
    return null;
  }
  return `${(money.amount / MINOR_UNITS_PER_UNIT).toFixed(2)} ${money.currency ?? "USD"}`;
}

/**
 * Builds the one-line `$summary` shared by every paginated list and search action, so an
 * agent can always tell a genuine "no matches" from "stopped looking".
 *
 * @param {Object} opts
 * @param {number} opts.count - How many records are being returned.
 * @param {string} opts.noun - Pluralized record name, e.g. `card(s)`.
 * @param {string} [opts.scope] - Trailing detail about the filter, e.g. ` matching amazon`.
 * @param {number} [opts.scanned] - How many records were fetched to find those matches.
 * @param {boolean} [opts.truncated] - Whether records remained unread.
 * @returns {string} The summary line.
 */
export function formatSearchSummary({
  count, noun, scope = "", scanned, truncated,
}) {
  const scanNote = scanned !== undefined && scanned !== count
    ? ` (scanned ${scanned})`
    : "";
  const moreNote = truncated
    ? ", more available — raise Max Results to fetch them"
    : "";
  return `Found ${count} ${noun}${scope}${scanNote}${moreNote}`;
}
