import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-post-reaction-with-emoji",
  name: "Post Reaction with Emoji",
  description: "Post a reaction for a message with an emoji. [See the docs here](https://discord.com/developers/docs/resources/channel#create-reaction)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
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
    emoji: {
      propDefinition: [
        discord,
        "emoji",
      ],
    },
  },
  async run({ $ }) {
    const {
      channelId,
      messageId,
      emoji: decodedEmoji,
    } = this;

    const emoji = encodeURIComponent(`${decodedEmoji}`);

    const response = await this.discord.createReaction({
      $,
      channelId,
      messageId,
      emoji,
    });

    if (!response) {
      return {
        emoji: decodedEmoji,
        success: true,
      };
    }

    return response;
  },
};
