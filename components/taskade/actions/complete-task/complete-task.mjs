import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-complete-task",
  name: "Complete Task",
  description: "Marks a task in a Taskade project as complete."
    + " Use **List Tasks** to find the task ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/complete-task)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
    const response = await this.taskade.completeTask({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully completed task with ID ${this.taskId}`);
    return response;
  },
};
