import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-add-reaction",
  name: "Add Reaction",
  description:
    "Add an emoji reaction to a message."
    + " Accepts a channel ID (preferred — resolves instantly) or channel name (resolved by"
    + " scanning up to 5 pages, ~5,000 channels, of the workspace's channel list — a name beyond"
    + " that bound will not be found)."
    + " Use **Get Channel History** or **Search** to find the message timestamp."
    + " Emoji name should be without colons (e.g. `thumbsup`, `fire`, `heart`)."
    + " [See the documentation](https://api.slack.com/methods/reactions.add)",
  version: "0.0.8",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    slack,
    channel: {
      type: "string",
      label: "Channel",
      description: "Prefer a channel ID (e.g. `C1234567890`) — use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans up to 5 pages (~5,000 channels) of the workspace's channel list, which can be slow — and a valid channel beyond that bound will not be found.",
    },
    timestamp: {
      type: "string",
      label: "Message Timestamp",
      description: "The `ts` of the message to react to (e.g. `1234567890.123456`).",
    },
    name: {
      type: "string",
      label: "Emoji Name",
      description: "The emoji name without colons (e.g. `thumbsup`, `fire`, `heart`).",
    },
  },
  async run({ $ }) {
    const channelId = await this.slack.resolveChannelId(this.channel);
    const response = await this.slack.addReactions({
      channel: channelId,
      timestamp: this.timestamp,
      name: this.name,
    });
    $.export("$summary", `Added :${this.name}: reaction`);
    return response;
  },
};
