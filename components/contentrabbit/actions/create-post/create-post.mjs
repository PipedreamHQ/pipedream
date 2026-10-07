import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-create-post",
  name: "Create Post",
  description: "Create a new post (draft or scheduled). [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/createPost)",
  version: "0.0.2",
  type: "action",
  props: {
    contentRabbitApp,
    platformType: {
      propDefinition: [
        contentRabbitApp,
        "platformType",
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
      type: "string",
      label: "Status",
      description: "Leave unset to default to `draft`, or `scheduled` automatically when `scheduledAt` is provided.",
      options: [
        "draft",
        "scheduled",
      ],
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "ISO 8601 datetime for scheduled publishing. Sets status to `scheduled`.",
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
    const response = await this.contentRabbitApp.createPost({
      $,
      data: {
        platformType: this.platformType,
        title: this.title,
        content: this.content,
        status: this.status,
        scheduledAt: this.scheduledAt,
        tags: this.tags,
      },
    });
    $.export("$summary", `Created post "${response.data?.id}"`);
    return response;
  },
};