import utils from "../../common/utils.mjs";
import app from "../../pixiebrix.app.mjs";

export default {
  key: "pixiebrix-add-group-memberships",
  name: "Add Group Memberships",
  description: "Adds user memberships to a group in PixieBrix. [See the documentation](https://docs.pixiebrix.com/developer-api/team-management-apis#add-group-memberships)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "The IDs or emails of the users to add to the group",
      propDefinition: [
        app,
        "userId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  methods: {
    addGroupMemberships({
      groupId, ...args
    } = {}) {
      return this.app.post({
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
      addGroupMemberships,
      groupId,
      userIds,
    } = this;

    await addGroupMemberships({
      $,
      groupId,
      data: utils.parseArray(userIds)
        ?.map((value) => {
          const isEmail = utils.isEmail(value);
          return {
            ...(isEmail && {
              email: value,
            }),
            ...(!isEmail && {
              user_id: value,
            }),
          };
        }),
    });

    $.export("$summary", `Successfully added memberships to group ID \`${groupId}\``);

    return {
      success: true,
    };
  },
};
