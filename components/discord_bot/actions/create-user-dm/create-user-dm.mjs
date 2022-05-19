import discord from "../../discord_bot.app.mjs";
import common from "../../common.mjs";

export default {
  key: "discord_bot-create-dm",
  name: "Create DM",
  description: "Create a new DM channel with a user. [See the docs here](https://discord.com/developers/docs/resources/user#create-dm)",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
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
  },
  async run({ $ }) {
    const recipientId = this.userId;
    const response = await this.discord.createDm({
      $,
      recipientId,
    });

    return response;
  },
};
