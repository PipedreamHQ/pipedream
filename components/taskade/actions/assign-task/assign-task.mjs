import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-assign-task",
  name: "Assign Task",
  description: "Assigns one or more users to a task in a Taskade project."
    + " Existing assignees stay on the task."
    + " Use **List Tasks** to find the task ID and **List Project Members** to find user handles."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/update-task-assignees)",
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
    assignees: {
      propDefinition: [
        taskade,
        "assignees",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taskade.assignTask({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
      data: {
        handles: this.assignees,
      },
    });
    $.export("$summary", `Successfully assigned ${this.assignees.length} user${this.assignees.length === 1
      ? ""
      : "s"} to task with ID ${this.taskId}`);
    return response;
  },
};
