export const listQueryPropDefinitions = {
  filter: {
    type: "string",
    label: "$filter",
    optional: true,
    description: "OData-style filter expression. [Filtering documentation](https://developer.servicem8.com/docs/filtering)",
  },
  sort: {
    type: "string",
    label: "$sort",
    optional: true,
    description: "Sort expression (e.g. `edit_date desc`)",
  },
  cursor: {
    type: "string",
    label: "cursor",
    optional: true,
    description: "Pagination cursor from a previous response",
  },
};

export function buildListParams({
  filter, sort, cursor,
}) {
  const params = {};
  if (filter !== undefined && filter !== "") params.$filter = filter;
  if (sort !== undefined && sort !== "") params.$sort = sort;
  if (cursor !== undefined && cursor !== "") params.cursor = cursor;
  return params;
}
