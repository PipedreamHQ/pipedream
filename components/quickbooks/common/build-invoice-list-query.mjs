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

/** Normalizes QuickBooks query `Invoice` payload to an array (single entity or list). */
export function invoicesFromInvoiceQueryResponse(response) {
  const raw = response?.QueryResponse?.Invoice;
  if (raw == null) {
    return [];
  }
  return Array.isArray(raw)
    ? raw
    : [
      raw,
    ];
}
