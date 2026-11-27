import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-delete-post",
  name: "Delete Post",
  description: "Permanently delete a post. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/deletePost)",
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