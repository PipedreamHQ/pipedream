import hubstaff from "../../hubstaff.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hubstaff-list-tasks",
  name: "List Tasks",
  description: "Retrieves a list of all tasks from your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2)",
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
      optional: true,
    },
    status: {
      propDefinition: [
        hubstaff,
        "status",
      ],
      optional: true,
    },
    userIds: {
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
    const response = await this.hubstaff.listAllTasks({
      organizationId: this.organizationId,
      projectId: this.projectId,
      status: this.status,
      userIds: this.userIds,
    });

    $.export("$summary", "Successfully retrieved tasks");
    return response;
  },
};
