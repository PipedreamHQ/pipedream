"use strict";

const API_PATH = "api_1.0";

function resourceListPath(resource) {
  return `${API_PATH}/${resource}.json`;
}

function resourceItemPath(resource, uuid) {
  return `${API_PATH}/${resource}/${uuid}.json`;
}

function buildListQueryParams({
  filter, sort, cursor,
}) {
  const params = {};
  if (filter !== undefined && filter !== "") params.$filter = filter;
  if (sort !== undefined && sort !== "") params.$sort = sort;
  if (cursor !== undefined && cursor !== "") params.cursor = cursor;
  return params;
}

const listQueryPropDefinitions = {
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
    description: "Pagination cursor from a previous list response. Pass the cursor from the prior page to retrieve the next page until no cursor is returned.",
  },
};

module.exports = {
  API_PATH,
  resourceListPath,
  resourceItemPath,
  buildListQueryParams,
  listQueryPropDefinitions,
};
