import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-update-comment",
  name: "Update Comment",
  description: "Updates a comment. [See the docs here](https://developer.todoist.com/rest/v2/#update-a-comment)",
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
