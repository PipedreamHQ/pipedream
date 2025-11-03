import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-comment",
  name: "Delete Comment",
  description: "Deletes a comment. [See the docs here](https://developer.todoist.com/rest/v2/#delete-a-comment)",
  version: "0.0.4",
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
      description: "Project containing the comment to delete",
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
      description: "Task containing the comment to delete",
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
    return {
      id: commentId,
      success: true,
    };
  },
};
