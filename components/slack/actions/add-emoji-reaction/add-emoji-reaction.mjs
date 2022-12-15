import slack from "../../slack.app.mjs";

export default {
  key: "slack-add-emoji-reaction",
  name: "Add Emoji Reaction",
  description: "Add an emoji reaction to a message. [See docs here](https://api.slack.com/methods/reactions.add)",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      optional: false,
      description: "Channel to add reaction to, or channel where the message to add reaction to was posted (used with timestamp).",
    },
    timestamp: {
      propDefinition: [
        slack,
        "timestamp",
      ],
      optional: false,
      description: "Timestamp of the message to add reaction to.",
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
      description: "Provide an emoji to use as the icon for this reaction. E.g. `fire`",
      optional: false,
    },
  },
  async run() {
    return await this.slack.sdk().reactions.add({
      channel: this.conversation,
      timestamp: this.timestamp,
      name: this.icon_emoji,
    });
  },
};
