import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-update-post",
  name: "Update Post",
  description: "Partially update a post. Only provided fields are changed. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    title: {
      type: "string",
      label: "Title",
      description: "Post title.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Post body content.",
      optional: true,
    },
    status: {
      propDefinition: [
        contentRabbitApp,
        "status",
      ],
      description: "New post status.",
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "ISO 8601 datetime for scheduled publishing.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tags.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.updatePost({
      $,
      postId: this.postId,
      data: {
        title: this.title,
        content: this.content,
        status: this.status,
        scheduledAt: this.scheduledAt,
        tags: this.tags,
      },
    });
    $.export("$summary", `Updated post "${response.data?.id}"`);
    return response;
  },
};
