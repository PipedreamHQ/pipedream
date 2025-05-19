import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-backlink-summary",
  name: "Get Backlink Summary",
  description:
    "Get an overview of backlinks data available for a given domain, subdomain, or webpage. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/search/live/?bash)",
  version: "0.0.2",
  type: "action",
  methods: {
    getBacklinkSummary(args = {}) {
      return this._makeRequest({
        path: "/backlinks/summary/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    target: {
      type: "string",
      label: "Target",
      description:
        "Domain, subdomain or webpage to get data for. A domain or a  subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
    },
    includeSubdomains: {
      type: "boolean",
      label: "Include Subdomains",
      description:
        "Whether the subdomains of the `target` will be included in the search. Default is `true`",
      optional: true,
    },
    includeIndirectLinks: {
      type: "boolean",
      label: "Include Indirect Links",
      description:
        "Whether indirect links to the target will be included in the results. Default is `true`",
      optional: true,
    },
    excludeInternalBacklinks: {
      type: "boolean",
      label: "Exclude Internal Backlinks",
      description:
        "Indicates if internal backlinks from subdomains to the target will be excluded from the results. Default is `true`",
      optional: true,
    },
    internalListLimit: {
      type: "integer",
      label: "Internal List Limit",
      description:
        "Maximum number of elements within internal arrays. [See the documentation](https://docs.dataforseo.com/v3/backlinks/summary/live/?bash#internal_list_limit) for more information",
      default: 10,
      max: 1000,
      optional: true,
    },
    backlinksStatusType: {
      type: "string",
      label: "Include Indirect Links",
      description:
        "You can use this field to choose what backlinks will be returned and used for aggregated metrics for your target",
      optional: true,
      options: [
        {
          value: "all",
          label: "All backlinks will be returned and counted",
        },
        {
          value: "live",
          label:
            "Backlinks found during the last check will be returned and counted",
        },
        {
          value: "lost",
          label: "Lost backlinks will be returned and counted",
        },
      ],
      default: "live",
    },
    backlinksFilters: {
      type: "string[]",
      label: "Backlinks Filters",
      description:
        "You can use this field to filter the initial backlinks that will be included in the dataset for aggregated metrics for your target. [See the documentation](https://docs.dataforseo.com/v3/backlinks/summary/live/?bash#backlinks_filters) for more information. Example: `[\"dofollow\", \"=\", true]`",
      optional: true,
    },
    rankScale: {
      type: "string",
      label: "Rank Scale",
      description:
        "Whether rank values are presented on a 0-100 or 0-1000 scale",
      optional: true,
      options: [
        "one_hundred",
        "one_thousand",
      ],
      default: "one_thousand",
    },
    tag: {
      type: "string",
      label: "Tag",
      description:
        "You can use this parameter to identify the task and match it with the result.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.getBacklinkSummary({
      $,
      data: [
        {
          target: this.target,
          include_subdomains: this.includeSubdomains,
          include_indirect_links: this.includeIndirectLinks,
          exclude_internal_backlinks: this.excludeInternalBacklinks,
          internal_list_limit: this.internalListLimit,
          backlinks_status_type: this.backlinksStatusType,
          backlinks_filters: this.backlinksFilters,
          rank_scale: this.rankScale,
          tag: this.tag,
        },
      ],
    });
    $.export(
      "$summary",
      "Successfully retrieved backlink summary",
    );
    return response;
  },
};
