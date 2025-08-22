import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-referring-domains",
  name: "Get Bulk Referring Domains",
  description:
    "Get the number of referring domains pointing to the specified domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_referring_domains/live/)",
  version: "0.0.2",
  type: "action",
  methods: {
    getBulkReferringDomains(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/bulk_referring_domains/live",
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
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.getBulkReferringDomains({
      $,
      data: [
        {
          targets: this.targets,
          tag: this.tag,
        },
      ],
    });
    $.export("$summary", "Successfully retrieved bulk referring domains");
    return response;
  },
};
