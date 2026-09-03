import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-update-task",
  name: "Update Task",
  description: "Update an existing task's title and description by ID. NOTE: the OpenPhone update endpoint only modifies `title` and `description` (both required on every update); due date and assignee are managed via other endpoints. Use **List Tasks** to find task IDs. Example: call with taskId=\"TK123abc\", title=\"Follow up (urgent)\", description=\"Customer asked about pricing tiers.\" → updates both fields and returns the updated task record. [See the documentation](https://www.openphone.com/docs/api-reference/tasks/update-a-task)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
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
    title: {
      type: "string",
      label: "Title",
      description: "The updated task title.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated task description.",
    },
  },
  async run({ $ }) {
    const response = await this.openphone.updateTask({
      taskId: this.taskId,
      $,
      data: {
        title: this.title,
        description: this.description,
      },
    });
    $.export("$summary", `Updated task ${this.taskId}`);
    return response;
  },
};
