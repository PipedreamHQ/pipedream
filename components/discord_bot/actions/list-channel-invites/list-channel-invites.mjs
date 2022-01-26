import common from "../common.mjs";
import constants from "../../constants.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-list-channel-invites",
  name: "List Channel Invites",
  description: "Return a list of invitees for the channel. Only usable for guild channels.",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    channelId: {
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: [
            ...constants.NOT_ALLOWED_CHANNELS,
            constants.CHANNEL_TYPES.GUILD_CATEGORY,
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    return this.discord.getChannelInvites({
      $,
      channelId: this.channelId,
    });
  },
};
