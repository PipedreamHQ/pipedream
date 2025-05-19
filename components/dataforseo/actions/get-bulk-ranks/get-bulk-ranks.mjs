import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-ranks",
  name: "Get Bulk Ranks",
  description:
    "Get rank scores of specified domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_ranks/live/)",
  version: "0.0.1",
  type: "action",
  methods: {
    getBacklinksBulkRanks(args = {}) {
      return this._makeRequest({
        path: "/backlinks/bulk_ranks/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    targets: {
      type: "string[]",
      label: "Targets",
      description: "Up to 1000 domains, subdomains or webpages to get `rank` for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
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
