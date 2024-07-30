import hubstaff from "../../hubstaff.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hubstaff-create-task",
  name: "Create Task",
  description: "Creates a new task on your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2)",
  version: "0.0.{{ts}}",
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
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A brief summary of the task",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task in ISO 8601 format",
      optional: true,
    },
    assigneeIds: {
      propDefinition: [
        hubstaff,
        "userIds",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      organizationId, projectId, summary, dueDate, assigneeIds,
    } = this;

    const response = await this.hubstaff.createTask({
      organizationId,
      projectId,
      summary,
      dueDate,
      assigneeIds,
    });

    $.export("$summary", `Successfully created task with ID ${response.id}`);
    return response;
  },
};
