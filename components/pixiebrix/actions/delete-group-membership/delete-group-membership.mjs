import app from "../../pixiebrix.app.mjs";

export default {
  key: "pixiebrix-delete-group-membership",
  name: "Delete Group Membership",
  description: "Deletes a single group membership. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis#delete-group-membership)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    groupId: {
      propDefinition: [
        app,
        "groupId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    membershipId: {
      propDefinition: [
        app,
        "membershipId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
  },
  methods: {
    deleteGroupMembership({
      groupId, membershipId, ...args
    } = {}) {
      return this.app.delete({
        headers: {
          "Accept": "application/json; version=1.0",
        },
        path: `/groups/${groupId}/memberships/${membershipId}/`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteGroupMembership,
      groupId,
      membershipId,
    } = this;

    await deleteGroupMembership({
      $,
      groupId,
      membershipId,
    });

    $.export("$summary", `Successfully deleted membership with ID: \`${membershipId}\``);

    return {
      success: true,
    };
  },
};
