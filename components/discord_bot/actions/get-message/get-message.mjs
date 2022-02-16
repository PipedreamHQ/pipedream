import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-get-message",
  name: "Get message",
  description: "Return a specific message in a channel. [See the docs here](https://discord.com/developers/docs/resources/channel#get-channel-message)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    messageId: {
      propDefinition: [
        discord,
        "channelMessage",
        ({ channelId }) => ({
          channelId,
        }),
      ],
    },
  },
  async run({ $ }) {
    return this.discord.getChannelMessage({
      $,
      channelId: this.channelId,
      messageId: this.messageId,
    });
  },
};
