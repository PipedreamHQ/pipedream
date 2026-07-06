import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-task",
  name: "Get Task",
  description: "Gets a single task by its ID (BETA). Run **List Tasks** first to obtain a valid task ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Tasks#getTask)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to retrieve. Run **List Tasks** first to obtain a valid task ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getTask({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully retrieved task ${this.taskId}`);
    return response;
  },
};
