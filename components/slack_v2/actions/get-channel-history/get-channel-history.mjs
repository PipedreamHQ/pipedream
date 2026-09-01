// x-pd-ai: optimized
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel-history",
  name: "Get Channel History",
  description:
    "Read the recent message history from a specific channel or direct message (DM)."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " To read a DM, pass the other person's **user ID** (e.g. `U1234567890`) as the channel — pass your OWN user ID to read your conversation with yourself."
    + " Use this when you want to see a channel's or DM's latest messages — unlike **Search** which finds messages by keyword."
    + " Returns messages with text, timestamps (ts), reactions, and user IDs."
    + " Message timestamps can be used with **Get Thread Replies**, **Edit Message**, and **Add Reaction**."
    + " **Pass `fields`** (e.g. `text,ts,user`) unless you need full message objects — raw Slack"
    + " messages carry blocks, attachments and edit metadata, so a busy channel can run to tens"
    + " of thousands of characters and be truncated before you see any of it."
    + " [See the documentation](https://api.slack.com/methods/conversations.history)",
  version: "0.2.2",
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
      description: "Channel ID (e.g. `C1234567890`) or channel name (e.g. `general` or `#general`). For a direct message, pass a user ID (e.g. `U1234567890`) — including your own, to read your self-DM. Resolved automatically.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return. Default: 20.",
      default: 20,
      optional: true,
    },
    oldest: {
      type: "string",
      label: "Oldest",
      description: "Only return messages posted after this timestamp (inclusive), as a Slack timestamp, e.g. `1610000000.000000` (Unix epoch seconds, optionally with fractional microseconds).",
      optional: true,
    },
    latest: {
      type: "string",
      label: "Latest",
      description: "Only return messages posted before this timestamp. Defaults to now. Same format as `Oldest`, e.g. `1610000000.000000`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Message properties to return, e.g. `text`, `ts`, `user`, `thread_ts`, `reply_count`, `reactions`. Recommended: `[\"text\", \"ts\", \"user\"]`. Omit only when you need the full message objects.",
      optional: true,
    },
  },
  async run({ $ }) {
    const channelId = await this.slack.resolveChannelId(this.channel);
    const response = await this.slack.conversationsHistory({
      channel: channelId,
      limit: this.limit ?? 20,
      oldest: this.oldest,
      latest: this.latest,
      include_all_metadata: true,
    });
    const messages = response.messages || [];

    $.export("$summary", `Retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"} from channel`);
    return {
      // `fields` is ADDITIVE: omitted returns exactly what this action always returned.
      // Measured at 17k chars average (worst 49k) without it.
      messages: utils.projectFields(messages, this.fields),
    };
  },
};
