import slack from "../../slack_bot.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "slack_bot-list-messages",
  name: "List Messages",
  description: "Read the message history of a channel, direct message (DM), or group DM using the bot token, newest first."
    + " Returns messages with text, timestamps (`ts`), user IDs, and reactions, plus `has_more` to tell whether older messages remain."
    + " To read further back, call again with `latest` set to the `ts` of the last message returned."
    + " Use **List Replies** with a message's `ts` to read its thread."
    + " [See the documentation](https://api.slack.com/methods/conversations.history)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
        () => ({
          types: [
            constants.CHANNEL_TYPE.PUBLIC,
            constants.CHANNEL_TYPE.PRIVATE,
            constants.CHANNEL_TYPE.MPIM,
            constants.CHANNEL_TYPE.IM,
          ],
        }),
      ],
      description: "The ID of the conversation to read, e.g. `C1234567890` for a channel or `D1234567890` for a DM."
        + " Use **List Channels** to find a channel ID (the `id` field)."
        + " A DM ID is the `channel` field of a message the bot received or of a **Send Message** response."
        + ` ${utils.CONVERSATION_PERMISSION_MESSAGE}`,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return, e.g. `50`. Default: 15."
        + " Slack apps distributed commercially outside the Slack Marketplace are capped at 15 messages and 1 request per minute; keep the default for those."
        + " Internal and Marketplace apps can request more, and results are paged automatically.",
      default: 15,
      min: 1,
      optional: true,
    },
    oldest: {
      type: "string",
      label: "Oldest",
      description: "Only return messages posted after this Slack timestamp, e.g. `1610000000.000000` (Unix epoch seconds, optionally with fractional microseconds)."
        + " A message with exactly this timestamp is excluded unless `Inclusive` is `true`.",
      optional: true,
    },
    latest: {
      type: "string",
      label: "Latest",
      description: "Only return messages posted before this Slack timestamp, e.g. `1610000000.000000`. Defaults to now."
        + " A message with exactly this timestamp is excluded unless `Inclusive` is `true`.",
      optional: true,
    },
    inclusive: {
      type: "boolean",
      label: "Inclusive",
      description: "Set to `true` to include messages whose timestamp equals `Oldest` or `Latest`, e.g. to fetch one known message. Ignored unless one of them is set. Default: `false`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.limit ?? 15;
    const messages = [];
    let cursor, hasMore;

    do {
      const response = await this.slack.conversationsHistory({
        channel: this.conversation,
        oldest: this.oldest,
        latest: this.latest,
        inclusive: this.inclusive,
        limit: Math.min(limit - messages.length, constants.LIMIT),
        cursor,
      });
      messages.push(...(response.messages || []));
      hasMore = !!response.has_more;
      cursor = response.response_metadata?.next_cursor;
    } while (hasMore && cursor && messages.length < limit);

    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return {
      messages,
      has_more: hasMore,
    };
  },
};
