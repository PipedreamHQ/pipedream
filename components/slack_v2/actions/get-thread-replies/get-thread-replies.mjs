import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-thread-replies",
  name: "Get Thread Replies",
  description:
    "Retrieve all replies in a message thread."
    + " Accepts a channel ID (preferred — resolves instantly) or channel name (resolved by"
    + " scanning up to 5 conversations.list pages, ~5,000 active public/private channels — a"
    + " name beyond that limit returns a configuration error)."
    + " To read a thread in a DM, pass the other person's **user ID** (e.g. `U1234567890`) as"
    + " the channel — pass your OWN user ID to read your conversation with yourself."
    + " Use **Get Channel History** or **Search** to find the parent message's timestamp (thread_ts)."
    + " Returns the parent message followed by all replies in chronological order."
    + " **Pass `fields`** (e.g. `text,ts,user`) unless you need full message objects — raw"
    + " Slack messages carry blocks, attachments and edit metadata, so a long thread can run"
    + " to tens of thousands of characters and be truncated before you see any of it."
    + " [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.1.6",
  type: "action",
  ai: "optimized",
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
      description: "Prefer a channel ID (e.g. `C1234567890`) — use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans up to 5 pages (~5,000 channels) of the workspace's channel list, which can be slow — and a valid channel beyond that bound will not be found. For a DM thread, pass a user ID (e.g. `U1234567890`) — including your own, to read your self-DM.",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Message properties to return, e.g. `text`, `ts`, `user`, `thread_ts`, `reply_count`, `reactions`, `permalink`. Recommended: `[\"text\", \"ts\", \"user\"]`. Omit only when you need the full message objects.",
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
      // `fields` is ADDITIVE: omitted returns exactly what this action always returned.
      // Supplied, it plucks per message — measured at 25k chars average on a busy thread,
      // which is the difference between the agent reading the replies and being handed a
      // file path instead.
      messages: utils.projectFields(messages, this.fields),
    };
  },
};
