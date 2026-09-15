import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-delete-post",
  name: "Delete Post",
  description: "Permanently deletes a post and its platform settings. This cannot be undone or recovered. If the goal is only to stop a scheduled publish, use the Unschedule Post action instead. [See the documentation](https://contentrabbitai.com/docs/api)",
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
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.deletePost({
      $,
      postId: this.postId,
    });
    $.export("$summary", `Deleted post "${this.postId}"`);
    return response;
  },
};
