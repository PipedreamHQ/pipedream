import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-delete-post",
  name: "Delete Post",
  description: "Permanently delete a post. [See the documentation](https://contentrabbitai.com/docs/api)",
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
