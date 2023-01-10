import common from "../../common.mjs";

export default {
  ...common,
  key: "discord_bot-list-channels",
  name: "List Channels",
  description: "Return a list of channels. [See the docs here](https://discord.com/developers/docs/resources/guild#get-guild-channels)",
  type: "action",
  version: "0.0.6",
  async run({ $ }) {
    return this.discord.getGuildChannels({
      $,
      guildId: this.guildId,
    });
  },
};
