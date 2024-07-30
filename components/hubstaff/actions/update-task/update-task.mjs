import hubstaff from "../../hubstaff.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hubstaff-update-task",
  name: "Update Task",
  description: "Update a specific task within your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hubstaff,
    taskId: {
      propDefinition: [
        hubstaff,
        "taskId",
        ({
          organizationId, projectId,
        }) => ({
          organizationId,
          projectId,
        }),
      ],
    },
    organizationId: {
      propDefinition: [
        hubstaff,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        hubstaff,
        "projectId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
      description: "The new name for the task",
      optional: true,
    },
    status: {
      propDefinition: [
        hubstaff,
        "status",
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        hubstaff,
        "userIds",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      taskId, organizationId, projectId, name, status, assignees,
    } = this;

    const response = await this.hubstaff.updateTask({
      taskId,
      organizationId,
      projectId,
      summary: name,
      status,
      assigneeIds: assignees,
    });

    $.export("$summary", `Successfully updated task with ID ${taskId}`);
    return response;
  },
};
