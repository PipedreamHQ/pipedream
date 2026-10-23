import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-get-post",
  name: "Get Post",
  description: "Fetch a single post by ID. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
    postId: {
      propDefinition: [
        contentRabbitApp,
        "postId",
      ],
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Optional fields to include: `platformSettings`, `publishedPlatforms`, `platformResults`.",
      optional: true,
      options: [
        "platformSettings",
        "publishedPlatforms",
        "platformResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.getPost({
      $,
      postId: this.postId,
      params: {
        include: this.include?.join(","),
      },
    });
    $.export("$summary", `Fetched post "${response.data?.id}"`);
    return response;
  },
};
