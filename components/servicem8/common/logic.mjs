/**
 * Pure helpers and shared list-query prop definitions for the ServiceM8 app.
 * Shared by `servicem8.app.mjs` and unit tests.
 * @module servicem8/common/logic
 */

/** REST API version path segment used in list and item URLs. */
export const API_PATH = "api_1.0";

/**
 * ServiceM8 API resources with display labels. Aligned with
 * [ServiceM8 REST API reference](https://developer.servicem8.com/reference).
 */
export const RESOURCES = {
  job: {
    label: "Job",
    noun: "job",
  },
  company: {
    label: "Company",
    noun: "company",
  },
  companycontact: {
    label: "Company Contact",
    noun: "company contact",
  },
  jobcontact: {
    label: "Job Contact",
    noun: "job contact",
  },
  jobactivity: {
    label: "Job Activity",
    noun: "job activity",
  },
  jobmaterial: {
    label: "Job Material",
    noun: "job material",
  },
  jobpayment: {
    label: "Job Payment",
    noun: "job payment",
  },
  category: {
    label: "Category",
    noun: "category",
  },
  staff: {
    label: "Staff",
    noun: "staff member",
  },
  queue: {
    label: "Queue",
    noun: "queue",
  },
  note: {
    label: "Note",
    noun: "note",
  },
  dboattachment: {
    label: "Attachment",
    noun: "attachment",
  },
  badge: {
    label: "Badge",
    noun: "badge",
  },
  feedback: {
    label: "Feedback",
    noun: "feedback item",
  },
};

/**
 * Builds the relative list URL path for a resource (e.g. `api_1.0/job.json`).
 * @param {string} resource - Resource key (e.g. `job`, `company`)
 * @returns {string}
 */
export function resourceListPath(resource) {
  return `${API_PATH}/${resource}.json`;
}

/**
 * Builds the relative item URL path for a resource UUID.
 * @param {string} resource - Resource key
 * @param {string} uuid - Record UUID
 * @returns {string}
 */
export function resourceItemPath(resource, uuid) {
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
export function buildListQueryParams({
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
    description: "Pagination cursor from a previous list response. Pass the cursor from the prior page to retrieve the next page until no cursor is returned.",
  },
};
