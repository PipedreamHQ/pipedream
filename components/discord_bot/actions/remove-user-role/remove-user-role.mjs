import common from "../../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-remove-user-role",
  name: "Remove User Role",
  description: "Remove a selected role from the specified user. [See the docs here](https://discord.com/developers/docs/resources/guild#remove-guild-member-role)",
  type: "action",
  version: "1.0.2",
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
      description: "Please select the role you want to remove from the user",
      propDefinition: [
        discord,
        "roleId",
        ({
          guildId, userId,
        }) => ({
          guildId,
          userId,
          isAddRole: false,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.discord.removeGuildMemberRole({
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
