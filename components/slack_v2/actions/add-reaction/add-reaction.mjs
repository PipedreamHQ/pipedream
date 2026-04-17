import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-add-reaction",
  name: "Add Reaction",
  description:
    "Add an emoji reaction to a message."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Use **Get Channel History** or **Search** to find the message timestamp."
    + " Emoji name should be without colons (e.g. `thumbsup`, `fire`, `heart`)."
    + " [See the documentation](https://api.slack.com/methods/reactions.add)",
  version: "0.0.1",
  type: "action",
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
      description: "Channel ID (e.g. `C1234567890`) or channel name (e.g. `general` or `#general`). Resolved automatically.",
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
