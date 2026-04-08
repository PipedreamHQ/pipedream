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

  const oc = orderClause
    ? ` ORDERBY  ${orderClause}`
    : "";
  const sp = startPosition
    ? ` STARTPOSITION  ${startPosition}`
    : "";
  const mr = maxResults
    ? ` MAXRESULTS ${maxResults}`
    : "";
  return `${defaultSql}${oc}${sp}${mr}`;
}
