import { ConfigurationError } from "@pipedream/platform";

const NUMERIC_STRING = /^\d+$/;

function normalizedNumericClause(value) {
  if (value == null) {
    return "";
  }
  const s = String(value).trim();
  return NUMERIC_STRING.test(s)
    ? s
    : "";
}

/**
 * When a custom query is provided, it must target Invoice so responses match
 * `invoicesFromInvoiceQueryResponse`.
 */
export function assertCustomQueryTargetsInvoice(customQuery) {
  const trimmed = typeof customQuery === "string"
    ? customQuery.trim()
    : "";
  if (!trimmed) {
    return;
  }
  if (!/\bfrom\s+invoice\b/i.test(trimmed)) {
    throw new ConfigurationError(
      "Custom query must select from Invoice (e.g. select * from Invoice where ...).",
    );
  }
}

/**
 * Builds Invoice query SQL for list-open-invoices / list-past-due-invoices.
 * Whitespace-only `customQuery` is ignored so the default SQL and pagination apply.
 * A non-empty trimmed `customQuery` is returned as the full query (no pagination append).
 */
export function buildInvoiceListQuery({
  customQuery,
  defaultSql,
  orderClause,
  startPosition,
  maxResults,
}) {
  const trimmed = typeof customQuery === "string"
    ? customQuery.trim()
    : "";
  if (trimmed) {
    return trimmed;
  }

  const orderTrimmed = typeof orderClause === "string"
    ? orderClause.trim()
    : "";
  const oc = orderTrimmed.length > 0
    ? ` ORDERBY  ${orderTrimmed}`
    : "";

  const spPos = normalizedNumericClause(startPosition);
  const sp = spPos
    ? ` STARTPOSITION  ${spPos}`
    : "";

  const mrVal = normalizedNumericClause(maxResults);
  const mr = mrVal
    ? ` MAXRESULTS ${mrVal}`
    : "";
  return `${defaultSql}${oc}${sp}${mr}`;
}

/**
 * Normalizes QuickBooks Invoice query results to an array.
 * Returns [] unless QueryResponse includes an Invoice property (Invoice-targeting query).
 */
export function invoicesFromInvoiceQueryResponse(response) {
  const qr = response?.QueryResponse;
  if (!qr || !Object.hasOwn(qr, "Invoice")) {
    return [];
  }
  const raw = qr.Invoice;
  if (raw == null) {
    return [];
  }
  return Array.isArray(raw)
    ? raw
    : [
      raw,
    ];
}
