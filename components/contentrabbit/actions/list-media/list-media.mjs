import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-media",
  name: "List Media",
  description: "List images or videos in the media library. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Media/listImages)",
  version: "0.0.2",
  type: "action",
  props: {
    contentRabbitApp,
    mediaType: {
      propDefinition: [
        contentRabbitApp,
        "mediaType",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "Case-insensitive search against title, description, and alt text (images).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of items per page (1-100).",
      default: 25,
      min: 1,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.listMedia({
      $,
      type: this.mediaType,
      params: {
        search: this.search,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved ${response.data?.length ?? 0} ${this.mediaType}`);
    return response;
  },
};