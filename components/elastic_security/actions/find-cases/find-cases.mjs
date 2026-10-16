import elasticSecurity from "../../elastic_security.app.mjs";
import { pickFields } from "../../common/utils.mjs";

export default {
  key: "elastic_security-find-cases",
  name: "Find Cases",
  description: "Find and list Elastic Security cases via GET /api/cases/_find, or fetch a single case directly via GET /api/cases/{caseId} when `caseId` is provided."
    + " Use this to search/browse cases, or to look up one case's full details (including its `version` token) once you have an ID."
    + " Run this first to obtain a `caseId` before using **Create or Update Case**, **Add Case Comment**, or **Delete Record**."
    + " Example: calling with `search: \"perimeter breach\"` and `status: \"open\"` returns `{ total: 1, cases: [{ id: \"a1c1...\", title: \"Isla Nublar Perimeter Breach\", severity: \"high\", status: \"open\", ... }] }`; use `fields` to shrink each case down to just the fields you need."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-findcasesdefaultspace)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
    caseId: {
      propDefinition: [
        elasticSecurity,
        "caseId",
      ],
      description: "Fetch a single case directly by ID instead of searching. When provided, all other search/filter parameters are ignored.",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Free-text search string to match against case fields. Ignored when `caseId` is provided.",
      optional: true,
    },
    status: {
      propDefinition: [
        elasticSecurity,
        "status",
      ],
      description: "Filter by case status. One of: `open`, `in-progress`, `closed`. Ignored when `caseId` is provided.",
      optional: true,
    },
    severity: {
      propDefinition: [
        elasticSecurity,
        "severity",
      ],
      description: "Filter by case severity. One of: `low`, `medium`, `high`, `critical`. Ignored when `caseId` is provided.",
      optional: true,
    },
    tags: {
      propDefinition: [
        elasticSecurity,
        "tags",
      ],
      description: "Filter by one or more tags. Run **List Tags** first to see existing case tags. Ignored when `caseId` is provided.",
      optional: true,
    },
    sortField: {
      propDefinition: [
        elasticSecurity,
        "sortField",
      ],
      description: "Field to sort by (e.g. `createdAt`, `updatedAt`, `severity`, `status`). Ignored when `caseId` is provided.",
    },
    sortOrder: {
      propDefinition: [
        elasticSecurity,
        "sortOrder",
      ],
      description: "Sort direction: `asc` or `desc`. Ignored when `caseId` is provided.",
    },
    page: {
      propDefinition: [
        elasticSecurity,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        elasticSecurity,
        "perPage",
      ],
    },
    fields: {
      propDefinition: [
        elasticSecurity,
        "fields",
      ],
      description: "Only include these fields in each returned case, to reduce response size. Omit to return the full case object(s)."
        + " Common fields: `id`, `title`, `description`, `severity`, `status`, `tags`, `category`, `assignees`, `created_at`, `updated_at`, `version`, `totalComment`, `totalAlerts`.",
    },
  },
  async run({ $ }) {
    if (this.caseId) {
      const response = await this.elasticSecurity.getCase({
        $,
        caseId: this.caseId,
      });
      $.export("$summary", `Retrieved case "${response.title}" (${response.id})`);
      return pickFields(response, this.fields);
    }
    const response = await this.elasticSecurity.findCases({
      $,
      params: {
        search: this.search,
        status: this.status,
        severity: this.severity,
        tags: this.tags,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        page: this.page,
        perPage: this.perPage,
      },
    });
    $.export("$summary", `Found ${response.total} case(s)`);
    if (this.fields?.length) {
      return {
        ...response,
        cases: response.cases.map((c) => pickFields(c, this.fields)),
      };
    }
    return response;
  },
};
