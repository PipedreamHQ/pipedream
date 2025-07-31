import common from "../common/comment-props.mjs";

export default {
  ...common,
  key: "clickup-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment. [See the documentation](https://clickup.com/api) in **Comments / Deleet Comment** section.",
  version: "0.0.11",
  type: "action",
  async run({ $ }) {
    const { commentId } = this;

    const response = await this.clickup.deleteComment({
      $,
      commentId,
    });

    $.export("$summary", "Successfully deleted comment");

    return response;
  },
};
