import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-publish-post",
  name: "Publish Post",
  description: "Immediately publish a post to the selected platforms. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/publishPost)",
  version: "0.0.1",
  type: "action",
  props: {
    contentRabbitApp,
    postId: {
      propDefinition: [
        contentRabbitApp,
        "postId",
      ],
    },
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Override which platforms to publish to. Defaults to the post's configured platforms.",
      optional: true,
    },
    firstComment: {
      type: "string",
      label: "First Comment",
      description: "Optional first comment to post after publishing (supported on some platforms).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.publishPost({
      $,
      postId: this.postId,
      data: {
        platforms: this.platforms,
        firstComment: this.firstComment,
      },
    });
    $.export("$summary", `Published post "${this.postId}"`);
    return response;
  },
};