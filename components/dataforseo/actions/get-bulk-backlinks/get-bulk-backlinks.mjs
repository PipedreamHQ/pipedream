import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-ranks",
  name: "Get Bulk Ranks",
  description:
    "Get the number of backlinks pointing to specified  domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_backlinks/live/)",
  version: "0.0.1",
  type: "action",
  methods: {
    getBulkBacklinks(args = {}) {
      return this._makeRequest({
        path: "/backlinks/bulk_backlinks/live",
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
      description: "Up to 1000 domains, subdomains or webpages to get number of backlinks for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.getBulkBacklinks({
      $,
      data: [
        {
          targets: this.targets,
          tag: this.tag,
        },
      ],
    });
    $.export("$summary", "Successfully retrieved bulk backlinks");
    return response;
  },
};
