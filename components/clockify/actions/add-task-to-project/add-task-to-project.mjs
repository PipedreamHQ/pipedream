import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-add-task-to-project",
  name: "Add Task To Project",
  description: "Adds a task to a project in Clockify. [See the documentation](https://docs.clockify.me/#tag/Task/operation/create_7)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        clockify,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the task",
    },
    assigneeIds: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      label: "Assignees",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createTask({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      data: {
        name: this.name,
        assigneeIds: this.assigneeIds,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully added task with ID ${response.id} to project with ID ${this.projectId}.`);
    }

    return response;
  },
};
