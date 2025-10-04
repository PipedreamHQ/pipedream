import common from "../../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-find-channel",
  name: "Find Channel",
  description: "Find an existing channel by name. [See the docs here](https://discord.com/developers/docs/resources/guild#get-guild-channels)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    channelName: {
      description: "Channel name to look for in the Guild",
      propDefinition: [
        discord,
        "channelName",
      ],
    },
  },
  async run({ $ }) {
    const channels = await this.discord.getGuildChannels({
      $,
      guildId: this.guildId,
    });

    const channelFound =
      channels.find((channel) =>
        channel.name.toLowerCase() === this.channelName.trim().toLowerCase());

    if (!channelFound) {
      throw new Error("Channel not found");
    }

    return channelFound;
  },
};
