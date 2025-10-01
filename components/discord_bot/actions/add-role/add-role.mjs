import common from "../../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-add-role",
  name: "Add Role",
  description: "Assign a role to a user. Remember that your bot requires the `MANAGE_ROLES` permission. [See the docs here](https://discord.com/developers/docs/resources/guild#add-guild-member-role)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        discord,
        "userId",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
    roleId: {
      propDefinition: [
        discord,
        "roleId",
        ({
          guildId, userId,
        }) => ({
          guildId,
          userId,
          isAddRole: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.discord.addGuildMemberRole({
      $,
      guildId: this.guildId,
      userId: this.userId,
      roleId: this.roleId,
    });

    if (!response) {
      return {
        id: this.roleId,
        success: true,
      };
    }

    return response;
  },
};
