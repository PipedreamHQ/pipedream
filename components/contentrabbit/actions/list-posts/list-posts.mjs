import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-posts",
  name: "List Posts",
  description: "List posts with optional filters. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
    status: {
      propDefinition: [
        contentRabbitApp,
        "status",
      ],
    },
    platform: {
      propDefinition: [
        contentRabbitApp,
        "platformType",
      ],
      label: "Platform Filter",
      description: "Filter by platform (e.g. `twitter`, `linkedin`).",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Case-insensitive search against post title.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of posts per page (1-100).",
      default: 25,
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.listPosts({
      $,
      params: {
        status: this.status,
        platform: this.platform,
        search: this.search,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved ${response.data?.length ?? 0} posts`);
    return response;
  },
};
