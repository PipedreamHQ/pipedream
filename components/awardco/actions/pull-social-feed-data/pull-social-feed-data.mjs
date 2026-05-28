import awardco from "../../awardco.app.mjs";

export default {
  key: "awardco-pull-social-feed-data",
  name: "Pull Social Feed Data",
  description:
    "Retrieve social feed data from Awardco. [See the documentation](https://api.awardco.com/api#tag/feed/POST/social-feed).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    awardco,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      default: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of items per page",
      default: 10,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.awardco.getSocialFeed({
      $,
      data: {
        page: this.page ?? 1,
        limit: this.limit ?? 10,
      },
    });
    $.export("$summary", "Successfully retrieved social feed data");
    return response;
  },
};
