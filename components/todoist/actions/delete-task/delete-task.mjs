import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-task",
  name: "Delete Task",
  description: "Deletes a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/delete_task_api_v1_tasks__task_id__delete)",
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
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "Select the task to delete",
    },
  },
  async run ({ $ }) {
    const { task } = this;
    const data = {
      taskId: task,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteTask({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted task");
    return {
      id: task,
      success: true,
    };
  },
};
