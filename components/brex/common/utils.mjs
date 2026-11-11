const DEFAULT_CURRENCY = "USD";
const DEFAULT_MINOR_UNIT_DIGITS = 2;

/**
 * Reports how many decimal places a currency's smallest denomination represents, so `700`
 * scales to `7.00` in USD but stays `700` in JPY, which has no minor unit.
 *
 * @param {string} currency - An ISO 4217 currency code.
 * @returns {number} The currency's fraction digits, falling back to `2` for codes the
 * runtime does not recognize, since `Intl` throws on those.
 */
function minorUnitDigits(currency) {
  try {
    // eslint-disable-next-line no-undef -- Intl is provided by the Node runtime
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).resolvedOptions().maximumFractionDigits;
  } catch {
    return DEFAULT_MINOR_UNIT_DIGITS;
  }
}

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
  const currency = money.currency ?? DEFAULT_CURRENCY;
  const digits = minorUnitDigits(currency);
  return `${(money.amount / (10 ** digits)).toFixed(digits)} ${currency}`;
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

/**
 * Applies the merchant and amount filters that Brex cannot express server-side, shared by
 * every search action so a query behaves identically across transactions and expenses.
 *
 * @param {Object} opts
 * @param {string} [opts.descriptor] - The record's merchant descriptor, matched case-insensitively.
 * @param {number} [opts.amount] - The record's amount, in the currency's smallest denomination.
 * @param {string} [opts.merchantQuery] - Substring the descriptor must contain.
 * @param {number} [opts.minAmount] - Inclusive lower bound on the amount.
 * @param {number} [opts.maxAmount] - Inclusive upper bound on the amount.
 * @returns {boolean} Whether the record satisfies every filter that was provided.
 */
export function matchesAmountAndMerchant({
  descriptor, amount, merchantQuery, minAmount, maxAmount,
}) {
  if (merchantQuery
    && !(descriptor ?? "").toLowerCase().includes(merchantQuery.toLowerCase())) {
    return false;
  }
  if (minAmount != null && !(amount >= minAmount)) {
    return false;
  }
  if (maxAmount != null && !(amount <= maxAmount)) {
    return false;
  }
  return true;
}
