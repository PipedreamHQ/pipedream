import constants from "../../common/constants.mjs";
import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-list-channel-invites",
  name: "List Channel Invites",
  description: "Return a list of invitees for the channel. Only usable for guild channels.",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
