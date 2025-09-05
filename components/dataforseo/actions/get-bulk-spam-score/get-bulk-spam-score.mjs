import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-bulk-spam-score",
  name: "Get Bulk Spam Score",
  description:
    "Get spam scores of the specified domains, subdomains, and pages. [See the documentation](https://docs.dataforseo.com/v3/backlinks/bulk_spam_score/live/)",
  version: "0.0.2",
  type: "action",
  methods: {
    getBulkSpamScore(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/bulk_spam_score/live",
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
    const response = await this.getBulkSpamScore({
      $,
      data: [
        {
          targets: this.targets,
          tag: this.tag,
        },
      ],
    });
    $.export("$summary", "Successfully retrieved bulk spam score");
    return response;
  },
};
