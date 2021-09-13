import flatten from "lodash.flatten";
import uniqBy from "lodash.uniqby";
import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-list-users-with-emoji-reactions",
  name: "List Users that Reacted with Emoji",
  description: "Return a list of users that reacted with a specified emoji.",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    emoji: {
      propDefinition: [
        discord,
        "emoji",
      ],
    },
    limit: {
      propDefinition: [
        discord,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        discord,
        "after",
      ],
    },
    limitMessages: {
      label: "Messages limit",
      description: "Max number of messages to return (1-100)",
      default: 10,
      propDefinition: [
        discord,
        "limit",
      ],
    },
    afterMessageId: {
      label: "After message id",
      description: "Get messages after this message ID",
      propDefinition: [
        discord,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const {
      emoji: decodedEmoji,
      channelId,
      after,
      limit,
      limitMessages,
      afterMessageId,
    } = this;

    const emoji = encodeURIComponent(`${decodedEmoji}`);

    const messages = await this.discord.getMessages({
      $,
      channelId,
      limit: limitMessages,
      after: afterMessageId,
    });
    const messageIds = messages.map((message) => message.id);

    const requestUserReactions =
      messageIds
        .map((messageId) => {
          return this.discord.getUserReactions({
            $,
            channelId,
            emoji,
            messageId,
            after,
            limit,
          });
        });

    const userReactionsResults = await Promise.allSettled(requestUserReactions);

    const userReactions = userReactionsResults.map(({
      status, value, reason,
    }) => {
      return status === "fulfilled"
        ? value
        : reason.response.data;
    });

    const usersFlatten = flatten(userReactions);
    return uniqBy(usersFlatten, (user) => user.id);
  },
};
