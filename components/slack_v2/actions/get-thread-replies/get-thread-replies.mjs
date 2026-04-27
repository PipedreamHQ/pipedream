import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-thread-replies",
  name: "Get Thread Replies",
  description:
    "Retrieve all replies in a message thread."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Use **Get Channel History** or **Search** to find the parent message's timestamp (thread_ts)."
    + " Returns the parent message followed by all replies in chronological order."
    + " [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    channel: {
      type: "string",
      label: "Channel",
      description: "Channel ID (e.g. `C1234567890`) or channel name (e.g. `general` or `#general`). Resolved automatically.",
    },
    threadTs: {
      type: "string",
      label: "Thread Timestamp",
      description: "The `ts` of the parent message (e.g. `1234567890.123456`).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of replies to return. Default: 50.",
      default: 50,
      optional: true,
    },
  },
  async run({ $ }) {
    const channelId = await this.slack.resolveChannelId(this.channel);
    const response = await this.slack.getConversationReplies({
      channel: channelId,
      ts: this.threadTs,
      limit: this.limit ?? 50,
    });
    const messages = response.messages || [];
    const replyCount = Math.max(messages.length - 1, 0);
    $.export("$summary", `Retrieved ${replyCount} repl${replyCount === 1
      ? "y"
      : "ies"} in thread`);
    return {
      messages,
    };
  },
};
