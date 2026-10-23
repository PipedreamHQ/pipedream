/**
 * Build the query string for a Jsonify dataset serve URL.
 * @param {object} opts
 * @param {number} opts.limit - Rows per page, 1 to 10000.
 * @param {number} [opts.offset=0] - Rows to skip.
 * @param {string[]} [opts.columns] - Column names to return.
 * @param {object} [opts.filters] - Exact column matches, combined with AND.
 * @param {number} [opts.version] - Dataset version to read.
 * @returns {object} Query parameters for the serve URL.
 */
export function buildParams({
  limit, offset = 0, columns, filters, version,
}) {
  const params = {
    limit,
    offset,
  };
  if (columns?.length) {
    params.columns = columns.join(",");
  }
  if (version !== undefined && version !== null) {
    params.version = version;
  }
  for (const [
    column,
    value,
  ] of Object.entries(filters || {})) {
    params[`filter[${column}]`] = value;
  }
  return params;
}
