import dataforseo from "../../dataforseo.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";

export default {
  key: "dataforseo-get-backlinks-summary",
  name: "Get Backlinks Summary",
  description:
    "Get an overview of backlinks data available for a given domain, subdomain, or webpage. [See the documentation](https://docs.dataforseo.com/v3/backlinks/summary/live/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getBacklinksSummary(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/summary/live",
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
    backlinksStatusType: {
      propDefinition: [
        dataforseo,
        "backlinksStatusType",
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
      description: "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/backlinks/summary/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getBacklinksSummary({
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
      "Successfully retrieved backlink summary",
    );
    return response;
  },
};
