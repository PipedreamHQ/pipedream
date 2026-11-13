import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-update-task",
  name: "Update Task",
  description: "Replaces the text of a task in a Taskade project."
    + " The task keeps its position, subtasks, assignees and date."
    + " Use **List Tasks** to find the task ID."
    + " [See the documentation](https://docs.taskade.com/developers/comprehensive-api-guide/tasks/update-task)",
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
    content: {
      propDefinition: [
        taskade,
        "content",
      ],
      description: "The new text of the task, up to 2000 characters, e.g. `Review the launch checklist`.",
    },
    contentType: {
      propDefinition: [
        taskade,
        "contentType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taskade.updateTask({
      $,
      projectId: this.projectId,
      taskId: this.taskId,
      data: {
        contentType: this.contentType,
        content: this.content,
      },
    });
    $.export("$summary", `Successfully updated task with ID ${this.taskId}`);
    return response;
  },
};
