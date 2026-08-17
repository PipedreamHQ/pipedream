// x-pd-ai: optimized
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-delete-task",
  name: "Delete Task",
  description: "Permanently delete a task by ID. This cannot be undone. Use **List Tasks** to find task IDs. Example: call with taskId=\"TK123abc\" → the task is removed and the response confirms deletion. [See the documentation](https://www.openphone.com/docs/api-reference/tasks/delete-a-task-by-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    openphone,
    taskId: {
      propDefinition: [
        openphone,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openphone.deleteTask({
      taskId: this.taskId,
      $,
    });
    $.export("$summary", `Deleted task ${this.taskId}`);
    return response;
  },
};
