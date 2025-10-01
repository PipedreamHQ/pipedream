import { INCLUDE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import hubstaff from "../../hubstaff.app.mjs";

export default {
  key: "hubstaff-list-tasks",
  name: "List Tasks",
  description: "Retrieves a list of all tasks from your Hubstaff organization. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2#!/tasks/getV2OrganizationsOrganizationIdTasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      type: "string[]",
      optional: true,
    },
    status: {
      propDefinition: [
        hubstaff,
        "status",
      ],
      type: "string[]",
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
    include: {
      type: "string[]",
      label: "Include",
      description: "Specify related data to side load.",
      options: INCLUDE_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubstaff.listAllTasks({
      $,
      organizationId: this.organizationId,
      params: {
        include: parseObject(this.include),
        project_ids: parseObject(this.projectId),
        user_ids: parseObject(this.userIds),
        status: parseObject(this.status),
      },
    });

    $.export("$summary", `Successfully retrieved ${response.tasks.length} task(s)`);
    return response;
  },
};
