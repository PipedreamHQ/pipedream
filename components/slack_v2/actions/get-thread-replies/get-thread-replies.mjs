import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-thread-replies",
  name: "Get Thread Replies",
  description:
    "Retrieve all replies in a message thread."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Use **Get Channel History** or **Search** to find the parent message's timestamp (thread_ts)."
    + " Returns the parent message followed by all replies in chronological order."
    + " **Pass `fields`** (e.g. `text,ts,user`) unless you need full message objects — raw"
    + " Slack messages carry blocks, attachments and edit metadata, so a long thread can run"
    + " to tens of thousands of characters and be truncated before you see any of it."
    + " [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.1.0",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Message properties to return, e.g. `text`, `ts`, `user`, `thread_ts`, `reply_count`, `reactions`, `permalink`. Recommended: `[\"text\", \"ts\", \"user\"]`. Omit only when you need the full message objects.",
      optional: true,
    },
  },
  methods: {
    /** Keep only the requested properties; unknown names are ignored, not emitted as undefined. */
    pickFields(message, fields) {
      const out = {};
      for (const field of fields) {
        if (message[field] !== undefined) out[field] = message[field];
      }
      return out;
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

    // `fields` is ADDITIVE: omitted returns exactly what this action always returned.
    // Supplied, it plucks per message — measured at 25k chars average on a busy thread,
    // which is the difference between the agent reading the replies and being handed a
    // file path instead.
    const requested = Array.isArray(this.fields)
      ? this.fields
      : (typeof this.fields === "string" && this.fields.length
        ? this.fields.split(",")
          .map((f) => f.trim())
          .filter(Boolean)
        : null);

    $.export("$summary", `Retrieved ${replyCount} repl${replyCount === 1
      ? "y"
      : "ies"} in thread`);
    return {
      messages: requested?.length
        ? messages.map((m) => this.pickFields(m, requested))
        : messages,
    };
  },
};
