import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-delete-message",
  name: "Delete message",
  description: "Delete a message. [See the docs here](https://discord.com/developers/docs/resources/channel#delete-message)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.discord.deleteChannelMessage({
      $,
      channelId: this.channelId,
      messageId: this.messageId,
    });

    if (!response) {
      return {
        id: this.messageId,
        success: true,
      };
    }

    return response;
  },
};
