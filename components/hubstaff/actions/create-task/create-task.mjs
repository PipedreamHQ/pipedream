import { ConfigurationError } from "@pipedream/platform";
import hubstaff from "../../hubstaff.app.mjs";

export default {
  key: "hubstaff-create-task",
  name: "Create Task",
  description: "Creates a new task on your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2#!/tasks/postV2ProjectsProjectIdTasks)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    try {
      const response = await this.hubstaff.createTask({
        $,
        projectId: this.projectId,
        data: {
          summary: this.summary,
          assignee_id: this.assigneeId,
        },
      });

      $.export("$summary", `Successfully created task with ID ${response.task.id}`);
      return response;
    } catch ({ message }) {
      const { error } = JSON.parse(message);
      throw new ConfigurationError(error);
    }
  },
};
