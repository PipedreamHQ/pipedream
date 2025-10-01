import common from "../../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-change-nickname",
  name: "Change Nickname",
  description: "Modifies the nickname of the current user in a guild.",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    nick: {
      propDefinition: [
        discord,
        "nick",
      ],
    },
  },
  async run({ $ }) {
    const {
      nick,
      guildId,
    } = this;

    const response = await this.discord.changeNickname({
      $,
      nick,
      guildId,
    });

    $.export("$summary", `Nickname Successfully changed to \`${nick}\`!`);
    return response;
  },
};
