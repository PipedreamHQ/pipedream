import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-delete-task",
  name: "Delete Task",
  description: "Permanently deletes a task and all of its subtasks (BETA). This is irreversible. Run **List Tasks** first to obtain a valid task ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Tasks#deleteTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedriveApp,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to delete. Run **List Tasks** first to obtain a valid task ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.deleteTask({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully deleted task ${this.taskId}`);
    return response;
  },
};
