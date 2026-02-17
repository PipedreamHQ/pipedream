import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-uncomplete-task",
  name: "Uncomplete Task",
  description: "Uncompletes a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/reopen_task_api_v1_tasks__task_id__reopen_post)",
  version: "0.0.5",
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
    },
    taskId: {
      propDefinition: [
        todoist,
        "completedTask",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const { taskId } = this;
    // No interesting data is returned from Todoist
    await this.todoist.reopenTask({
      $,
      params: {
        taskId,
      },
    });
    $.export("$summary", "Successfully reopened task");
    return {
      id: taskId,
      success: true,
    };
  },
};
