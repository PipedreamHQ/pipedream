import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-comment",
  name: "Update Comment",
  description: "Updates a comment. [See the documentation](https://developer.todoist.com/api/v1#tag/Comments/operation/update_comment_api_v1_comments__comment_id__post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Project containing the comment to update",
      optional: false,
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "Task containing the comment to update",
      optional: true,
    },
    commentId: {
      propDefinition: [
        todoist,
        "commentId",
        (c) => ({
          project: c.project,
          task: c.task,
        }),
      ],
    },
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
      optional: false,
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
    // No interesting data is returned from Todoist
    await this.todoist.updateComment({
      $,
      data,
    });
    $.export("$summary", "Successfully updated comment");
    return {
      id: commentId,
      success: true,
    };
  },
};
