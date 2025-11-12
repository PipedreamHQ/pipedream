import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-referring-domains",
  name: "Get Referring Domains",
  description:
    "Get detailed overview of referring domains pointing to the specified target. [See the documentation](https://docs.dataforseo.com/v3/backlinks/referring_domains/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getReferringDomains(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/referring_domains/live",
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
      description: "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/backlinks/referring_domains/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getReferringDomains({
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
    $.export("$summary", "Successfully retrieved referring domains");
    return response;
  },
};
