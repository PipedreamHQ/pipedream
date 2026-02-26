import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-create-task-comment",
  name: "Create Task Comment",
  description: "Adds a comment to a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Comments/operation/create_comment_api_v1_comments_post)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
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
      description: "Project containing the task to add a comment to",
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "Task to add new comment to",
    },
    content: {
      propDefinition: [
        todoist,
        "content",
      ],
      label: "Comment",
      optional: false,
    },
  },
  async run ({ $ }) {
    const {
      task,
      content,
    } = this;
    const data = {
      task_id: task,
      content,
    };
    const resp = await this.todoist.createComment({
      $,
      data,
    });
    $.export("$summary", "Successfully created comment");
    return resp;
  },
};
