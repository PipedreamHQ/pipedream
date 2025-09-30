import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-mark-task-completed",
  name: "Mark Task as Completed",
  description: "Marks a task as being completed. [See the docs here](https://developer.todoist.com/rest/v2/#close-a-task)",
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
    },
    taskId: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "The task to mark as complete",
    },
  },
  async run ({ $ }) {
    const { taskId } = this;
    // No interesting data is returned from Todoist
    await this.todoist.closeTask({
      $,
      params: {
        taskId,
      },
    });
    $.export("$summary", "Successfully closed task");
    return {
      id: taskId,
      success: true,
    };
  },
};
