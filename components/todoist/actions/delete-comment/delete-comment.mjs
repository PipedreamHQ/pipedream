import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment [See the docs here](https://developer.todoist.com/rest/v1/#delete-a-comment)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    commentId: {
      propDefinition: [
        todoist,
        "commentId",
      ],
    },
  },
  async run ({ $ }) {
    const { commentId } = this;
    const data = {
      commentId,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteComment({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted comment");
  },
};
