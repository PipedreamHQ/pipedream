// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";
import {
  applyFieldSelection,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-jobs",
  name: "Search Jobs",
  description: "Search jobs when the workflow needs hiring-company opportunities, role fit, or warm paths into employers. Use **Search People** for candidate/advisor discovery, and enable With People when the workflow should return 1st/2nd-degree contacts at each hiring company. `filters.locations` scopes the hiring company/people, not the job posting itself — check `applied_filter_summary.people_company_scope` in the response to see how a location filter was actually applied, and don't retry the same query with reworded locations if it comes back `applied_as_job_posting_filters: false`, since that's a scope limitation, not a bad query. Job rows can be large — pass Fields (flat field names only, e.g. `title`, `company_name`, `location`, `primary_source_url`; there is no nested `company.name` path) to keep the result small. [See the documentation](https://supercarl.ai/docs#endpoints-jobs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    query: {
      propDefinition: [
        superCarl,
        "query",
      ],
    },
    filters: {
      propDefinition: [
        superCarl,
        "filters",
      ],
    },
    withPeople: {
      propDefinition: [
        superCarl,
        "withPeople",
      ],
      description: "Include 1st and 2nd degree people at each hiring company.",
    },
    previewLimit: {
      propDefinition: [
        superCarl,
        "previewLimit",
      ],
    },
    peoplePerCompany: {
      type: "integer",
      label: "People Per Company",
      description: "Maximum people to include per hiring company when With People is enabled.",
      optional: true,
      default: 3,
      min: 1,
      max: 10,
    },
    ranking: {
      type: "object",
      label: "Ranking",
      description: "Optional ranking configuration JSON, for example `{ \"intent\": \"warm_intro\" }`.",
      optional: true,
    },
    delegateUserId: {
      propDefinition: [
        superCarl,
        "delegateUserId",
      ],
    },
    fields: {
      propDefinition: [
        superCarl,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const filters = parseObjectProp(this.filters, "Filters");
    const ranking = parseObjectProp(this.ranking, "Ranking");
    requireQueryOrFilters({
      query: this.query,
      filters,
    });

    const response = await this.superCarl.searchJobs({
      $,
      withPeople: this.withPeople,
      data: {
        query: this.query,
        filters,
        preview_limit: this.previewLimit,
        people_per_company: this.withPeople
          ? this.peoplePerCompany
          : undefined,
        ranking,
        delegate_user_id: this.delegateUserId,
      },
    });

    $.export("$summary", countSummary({
      total: response?.total,
      rows: response?.results,
      rowLabel: "jobs",
    }));

    return this.fields?.length
      ? {
        ...response,
        results: applyFieldSelection(response?.results, this.fields),
      }
      : response;
  },
};
