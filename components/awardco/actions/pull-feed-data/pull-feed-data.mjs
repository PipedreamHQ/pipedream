import awardco from "../../awardco.app.mjs";

export default {
  key: "awardco-pull-feed-data",
  name: "Pull Feed Data",
  description:
    "Retrieve feed data from Awardco (social feed or custom feed). [See the documentation](https://api.awardco.com/api#tag/feed).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    awardco,
    feedSource: {
      type: "string",
      label: "Feed source",
      description:
        "**Social feed** uses `POST /social-feed`. **Custom feed** uses `GET /v1/custom-feed`.",
      options: [
        {
          label: "Social feed",
          value: "social",
        },
        {
          label: "Custom feed",
          value: "custom",
        },
      ],
      default: "social",
      reloadProps: true,
    },
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
  async additionalProps() {
    if (this.feedSource !== "custom") {
      return {};
    }
    return {
      metadataFilter: {
        type: "string",
        label: "Metadata filter",
        description: "Optional filter string for custom feed results",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const page = this.page ?? 1;
    const limit = this.limit ?? 10;

    if (this.feedSource === "custom") {
      const response = await this.awardco.getCustomFeed({
        page,
        limit,
        metadataFilter: this.metadataFilter,
      });
      $.export("$summary", "Successfully retrieved custom feed data");
      return response;
    }

    const response = await this.awardco.getSocialFeed({
      page,
      limit,
    });
    $.export("$summary", "Successfully retrieved social feed data");
    return response;
  },
};
