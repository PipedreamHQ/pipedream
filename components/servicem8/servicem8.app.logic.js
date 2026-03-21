/**
 * Pure helpers and shared list-query prop definitions for the ServiceM8 app.
 * Used by `servicem8.app.mjs` and unit tests without loading ESM.
 * @module servicem8.app.logic
 */
"use strict";

/** REST API version path segment used in list and item URLs. */
const API_PATH = "api_1.0";

/**
 * Builds the relative list URL path for a resource (e.g. `api_1.0/job.json`).
 * @param {string} resource - Resource key (e.g. `job`, `company`)
 * @returns {string}
 */
function resourceListPath(resource) {
  return `${API_PATH}/${resource}.json`;
}

/**
 * Builds the relative item URL path for a resource UUID.
 * @param {string} resource - Resource key
 * @param {string} uuid - Record UUID
 * @returns {string}
 */
function resourceItemPath(resource, uuid) {
  return `${API_PATH}/${resource}/${uuid}.json`;
}

/**
 * Maps list-action props to ServiceM8 query parameters (`$filter`, `$sort`, `cursor`).
 * Omits empty strings so unset optional props are not sent.
 * @param {object} opts
 * @param {string} [opts.filter]
 * @param {string} [opts.sort]
 * @param {string} [opts.cursor]
 * @returns {Record<string, string>}
 */
function buildListQueryParams({
  filter, sort, cursor,
}) {
  const params = {};
  if (filter !== undefined && filter !== "") params.$filter = filter;
  if (sort !== undefined && sort !== "") params.$sort = sort;
  if (cursor !== undefined && cursor !== "") params.cursor = cursor;
  return params;
}

/**
 * Pipedream prop definitions for `$filter`, `$sort`, and `cursor` on list actions.
 * @type {Record<string, { type: string, label: string, optional: boolean, description: string }>}
 */
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
