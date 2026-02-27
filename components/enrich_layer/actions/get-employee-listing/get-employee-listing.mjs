import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-employee-listing",
  name: "Get Employee Listing",
  description: "Get a list of employees of a company. Cost: 3 credits per employee returned. [See the documentation](https://enrichlayer.com/docs/api/v2/company-api/employee-listing).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    url: {
      propDefinition: [
        enrichlayer,
        "companyProfileUrl",
      ],
    },
    coyNameMatch: {
      type: "string",
      label: "Company Name Match",
      description: "Include profiles that match the company name in addition to exact URL matches.",
      optional: true,
      options: [
        {
          label: "Include (default)",
          value: "include",
        },
        {
          label: "Exclude",
          value: "exclude",
        },
      ],
    },
    enrichProfiles: {
      propDefinition: [
        enrichlayer,
        "enrichProfiles",
      ],
    },
    booleanRoleSearch: {
      type: "string",
      label: "Boolean Role Search",
      description: "Filter employees by their title using boolean search expression (e.g., `\"founder\" OR \"co-founder\"`). Max 255 characters. Takes precedence over Role Search.",
      optional: true,
    },
    roleSearch: {
      type: "string",
      label: "Role Search (Deprecated)",
      description: "[DEPRECATED] Use Boolean Role Search instead. Filter employees by title using a regular expression.",
      optional: true,
    },
    country: {
      propDefinition: [
        enrichlayer,
        "country",
      ],
      description: "Limit results to employees in this country. Costs an extra 3 credits per result.",
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
    },
    employmentStatus: {
      propDefinition: [
        enrichlayer,
        "employmentStatus",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort employees by recency. Adds 50 credits base cost + 10 credits per employee returned.",
      optional: true,
      options: [
        {
          label: "None (default)",
          value: "none",
        },
        {
          label: "Recently Joined",
          value: "recently-joined",
        },
        {
          label: "Recently Left",
          value: "recently-left",
        },
        {
          label: "Oldest",
          value: "oldest",
        },
      ],
    },
    resolveNumericId: {
      type: "boolean",
      label: "Resolve Numeric ID",
      description: "Enable support for profile URLs with numerical IDs. Costs 2 extra credits.",
      optional: true,
      default: false,
    },
    useCache: {
      propDefinition: [
        enrichlayer,
        "useCache",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getEmployeeListing({
      $,
      params: {
        url: this.url,
        coy_name_match: this.coyNameMatch,
        enrich_profiles: this.enrichProfiles,
        boolean_role_search: this.booleanRoleSearch,
        role_search: this.roleSearch,
        country: this.country,
        page_size: this.pageSize,
        employment_status: this.employmentStatus,
        sort_by: this.sortBy,
        resolve_numeric_id: this.resolveNumericId,
        use_cache: this.useCache,
      },
    });
    $.export("$summary", `Successfully retrieved employees for ${this.url}`);
    return response;
  },
};
