import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-publish-post",
  name: "Publish Post",
  description: "Publishes a post immediately, bypassing any existing schedule, and marks it `published`. Publication to a live social network cannot be undone. `platforms` defaults to the post's own configured platforms when omitted. `firstComment` is only delivered on platforms that support a threaded first comment and is ignored elsewhere. [See the documentation](https://contentrabbitai.com/docs/api)",
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
    platforms: {
      propDefinition: [
        contentRabbitApp,
        "platformType",
      ],
      type: "string[]",
      label: "Platforms",
      description: "Override which platforms to publish to. Defaults to the post's own configured platforms when omitted.",
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
