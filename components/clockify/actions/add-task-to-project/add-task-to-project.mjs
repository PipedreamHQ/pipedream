// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-add-task-to-project",
  name: "Add Task To Project",
  description: "Adds a task to an existing project in a Clockify workspace. Tasks are the units of work that time entries are logged against, so create the task before calling **Log Time Entry** or **Start Timer** with a task. Optionally assign workspace members to it. Use **List Projects** to find the project ID. [See the documentation](https://docs.clockify.me/#tag/Task/operation/createTask)",
  version: "0.0.4",
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
      $.export("$summary", `Successfully added task with ID ${response.id} to project with ID ${this.projectId}`);
    }

    return response;
  },
};
