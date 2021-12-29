import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-comment",
  name: "Update Comment",
  description: "Updates a comment [See the docs here](https://developer.todoist.com/rest/v1/#update-a-comment)",
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
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
    },
  },
  async run ({ $ }) {
    const {
      commentId,
      content,
    } = this;
    const data = {
      commentId,
      content,
    };
    // No interesting data is returned from Hubspot
    await this.todoist.updateComment({
      $,
      data,
    });
    $.export("$summary", "Successfully updated comment");
  },
};
