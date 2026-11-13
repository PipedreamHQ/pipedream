import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-delete-task",
  name: "Delete Task",
  description: "Deletes a task and its subtasks from a Taskade project."
    + " To keep the task and mark it done, use **Complete Task** instead."
    + " Use **List Tasks** to find the task ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/delete-task)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    taskade,
    projectId: {
      propDefinition: [
        taskade,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        taskade,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taskade.deleteTask({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully deleted task with ID ${this.taskId}`);
    return response;
  },
};
