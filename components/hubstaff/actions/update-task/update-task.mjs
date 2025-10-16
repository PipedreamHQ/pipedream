import { ConfigurationError } from "@pipedream/platform";
import hubstaff from "../../hubstaff.app.mjs";

export default {
  key: "hubstaff-update-task",
  name: "Update Task",
  description: "Update a specific task within your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2#!/tasks/putV2TasksTaskId)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubstaff,
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
    summary: {
      propDefinition: [
        hubstaff,
        "summary",
      ],
    },
    assigneeId: {
      propDefinition: [
        hubstaff,
        "userIds",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string",
      label: "User ID",
      description: "Assignee user ID for this task.",
    },
    status: {
      propDefinition: [
        hubstaff,
        "status",
      ],
      options: [
        "active",
        "completed",
      ],
      optional: true,
    },
    lockVersion: {
      type: "integer",
      label: "Lock Version",
      description: "The lock version from the task fetch in order to update.",
      default: 0,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.hubstaff.updateTask({
        $,
        taskId: this.taskId,
        data: {
          summary: this.summary,
          lock_version: this.lockVersion,
          status: this.status,
          assignee_id: this.assigneeId,
        },
      });

      $.export("$summary", `Successfully updated task with ID ${this.taskId}`);
      return response;
    } catch ({ message }) {
      const { error } = JSON.parse(message);
      throw new ConfigurationError(error);
    }
  },
};
