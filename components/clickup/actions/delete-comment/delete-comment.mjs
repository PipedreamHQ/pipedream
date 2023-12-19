import common from "../common/comment-props.mjs";

export default {
  key: "clickup-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment. See the docs [here](https://clickup.com/api) in **Comments / Deleet Comment** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
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
