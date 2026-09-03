import { trimIfString } from "./utils.mjs";

/**
 * Builds the Search Console `dimensionFilterGroups` request field from either the
 * single-filter shortcut or the advanced JSON input. Shared by
 * `retrieve-site-performance-data` (whose shortcut value prop is the legacy
 * `subdomainFilter`) and `compare-search-analytics` (whose shortcut value prop is
 * `filterValue`), so the accepted input shapes stay identical across both tools.
 *
 * Accepted `advancedDimensionFilters` shapes (string or already-parsed):
 *   - bare filter array:  [{ dimension, operator, expression }, ...]
 *   - raw API groups:     [{ groupType: "and", filters: [...] }, ...]
 *   - a single object of either shape
 *
 * @returns {Array|undefined} the `dimensionFilterGroups` array, or undefined when no filter applies
 */
export function buildDimensionFilterGroups({
  app,
  filterValue,
  filterDimension,
  filterOperator,
  advancedDimensionFilters,
}) {
  // Normalized so whitespace-only input counts as absent, leaving
  // advancedDimensionFilters eligible instead of sending an empty-string filter.
  const expression = trimIfString(filterValue);

  if (expression) {
    return [
      {
        groupType: "and",
        filters: [
          {
            dimension: filterDimension || "page",
            operator: filterOperator || "contains",
            expression,
          },
        ],
      },
    ];
  }

  const advanced = trimIfString(advancedDimensionFilters);
  if (!advanced) {
    return undefined;
  }

  const parsed = app.parseIfJsonString(advanced, "Advanced Dimension Filters");
  const entries = Array.isArray(parsed)
    ? parsed
    : [
      parsed,
    ];

  if (!entries.length) {
    return undefined;
  }

  const [
    first,
  ] = entries;

  // A bare filter array is ANDed into a single group; raw groups pass through.
  if (first && typeof first === "object" && "dimension" in first) {
    return [
      {
        groupType: "and",
        filters: entries,
      },
    ];
  }

  return entries;
}
