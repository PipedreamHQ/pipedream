import app from "../../pixiebrix.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pixiebrix-update-group-membership",
  name: "Update Group Membership",
  description: "Updates the memberships of a group in PixieBrix. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis#update-group-membership)",
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
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "The IDs or emails of the users to update in the group",
      propDefinition: [
        app,
        "userId",
        ({ organizationId }) => ({
          organizationId,
          mapper: ({
            user: {
              email: value, name,
            },
          }) => ({
            label: [
              name,
              value,
            ].join(" ").trim(),
            value,
          }),
        }),
      ],
    },
  },
  methods: {
    updateGroupMemberships({
      groupId, ...args
    }) {
      return this.app.put({
        headers: {
          "Accept": "application/json; version=1.0",
        },
        path: `/groups/${groupId}/memberships/`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateGroupMemberships,
      groupId,
      userIds,
    } = this;

    await updateGroupMemberships({
      $,
      groupId,
      data: utils.parseArray(userIds)
        ?.map((value) => ({
          email: value,
        })),
    });

    $.export("$summary", `Successfully updated memberships of group ID \`${groupId}\``);

    return {
      success: true,
    };
  },
};
