import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-add-members-to-project",
  name: "Add Members To Project",
  description: "Adds member(s) to a project in Clockify. [See the documentation](https://docs.clockify.me/#tag/Project/operation/updateMemberships)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
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
    memberIds: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const memberships = this.memberIds.map((userId) => ({
      userId,
    }));

    const response = await this.clockify.updateMemberships({
      workspaceId: this.workspaceId,
      projectId: this.projectId,
      data: {
        memberships,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully added member(s) to project with ID ${this.projectId}.`);
    }

    return response;
  },
};
