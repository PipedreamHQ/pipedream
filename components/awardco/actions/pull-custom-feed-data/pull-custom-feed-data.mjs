import awardco from "../../awardco.app.mjs";

export default {
  key: "awardco-pull-custom-feed-data",
  name: "Pull Custom Feed Data",
  description:
    "Retrieve custom feed data from Awardco. [See the documentation](https://api.awardco.com/api#tag/feed/GET/v1/custom-feed).",
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
    metadataFilter: {
      type: "string",
      label: "Metadata filter",
      description: "Optional filter string for custom feed results",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.awardco.getCustomFeed({
      $,
      params: {
        page: this.page ?? 1,
        limit: this.limit ?? 10,
        metadataFilter: this.metadataFilter,
      },
    });
    $.export("$summary", "Successfully retrieved custom feed data");
    return response;
  },
};
