import dataforseo from "../../dataforseo.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "dataforseo-get-domain-pages-summary",
  name: "Get Domain Pages Summary",
  description:
    "Get detailed summary data on all backlinks and related metrics for each page of the specified domain or subdomain. [See the documentation](https://docs.dataforseo.com/v3/backlinks/domain_pages_summary/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getDomainPagesSummary(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/domain_pages_summary/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    target: {
      propDefinition: [
        dataforseo,
        "backlinksTarget",
      ],
    },
    backlinksStatusType: {
      propDefinition: [
        dataforseo,
        "backlinksStatusType",
      ],
    },
    includeSubdomains: {
      propDefinition: [
        dataforseo,
        "includeSubdomains",
      ],
    },
    includeIndirectLinks: {
      propDefinition: [
        dataforseo,
        "includeIndirectLinks",
      ],
    },
    excludeInternalBacklinks: {
      propDefinition: [
        dataforseo,
        "excludeInternalBacklinks",
      ],
    },
    backlinksFilters: {
      propDefinition: [
        dataforseo,
        "backlinksFilters",
      ],
    },
    rankScale: {
      propDefinition: [
        dataforseo,
        "rankScale",
      ],
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
    additionalOptions: {
      propDefinition: [
        dataforseo,
        "additionalOptions",
      ],
      description: "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/backlinks/domain_pages_summary/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getDomainPagesSummary({
      $,
      data: [
        {
          target: this.target,
          include_subdomains: this.includeSubdomains,
          include_indirect_links: this.includeIndirectLinks,
          exclude_internal_backlinks: this.excludeInternalBacklinks,
          backlinks_status_type: this.backlinksStatusType,
          backlinks_filters: this.backlinksFilters,
          rank_scale: this.rankScale,
          tag: this.tag,
          ...parseObjectEntries(this.additionalOptions),
        },
      ],
    });
    $.export(
      "$summary",
      "Successfully retrieved domain pages summary",
    );
    return response;
  },
};
