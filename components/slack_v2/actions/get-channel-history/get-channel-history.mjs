import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel-history",
  name: "Get Channel History",
  description:
    "Read the recent message history from a specific channel."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Use this when you want to see a channel's latest messages — unlike **Search** which finds messages by keyword."
    + " Returns messages with text, timestamps (ts), reactions, and user IDs."
    + " Message timestamps can be used with **Get Thread Replies**, **Edit Message**, and **Add Reaction**."
    + " [See the documentation](https://api.slack.com/methods/conversations.history)",
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
      description: "Only messages after this Unix timestamp. Inclusive.",
      optional: true,
    },
    latest: {
      type: "string",
      label: "Latest",
      description: "Only messages before this Unix timestamp. Default: now.",
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
      messages,
    };
  },
};
