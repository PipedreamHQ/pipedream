import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-ranks",
  name: "Get Bulk Ranks",
  description:
    "Get rank scores of specified domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_ranks/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getBacklinksBulkRanks(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/bulk_ranks/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    targets: {
      propDefinition: [
        dataforseo,
        "targets",
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
  },
  async run({ $ }) {
    const response = await this.getBacklinksBulkRanks({
      $,
      data: [
        {
          targets: this.targets,
          rank_scale: this.rankScale,
          tag: this.tag,
        },
      ],
    });
    $.export("$summary", "Successfully retrieved bulk ranks");
    return response;
  },
};
