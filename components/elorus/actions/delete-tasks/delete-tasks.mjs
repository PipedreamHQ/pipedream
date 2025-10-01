import app from "../../elorus.app.mjs";

export default {
  key: "elorus-delete-tasks",
  name: "Delete Tasks",
  description: "Delete a task from Elorus. [See the documentation](https://developer.elorus.com/#operation/tasks_delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteTasks({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", "Successfully deleted the task with ID: " + this.taskId);
    return response;
  },
};
