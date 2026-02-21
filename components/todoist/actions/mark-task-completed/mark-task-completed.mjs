import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-mark-task-completed",
  name: "Mark Task as Completed",
  description: "Marks a task as being completed. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/close_task_api_v1_tasks__task_id__close_post)",
  version: "0.0.6",
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
