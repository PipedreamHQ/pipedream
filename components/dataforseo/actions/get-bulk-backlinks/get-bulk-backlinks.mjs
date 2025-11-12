import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-backlinks",
  name: "Get Bulk Backlinks",
  description:
    "Get the number of backlinks pointing to specified domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_backlinks/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getBulkBacklinks(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/bulk_backlinks/live",
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
