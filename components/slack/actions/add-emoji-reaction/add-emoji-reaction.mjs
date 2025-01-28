import slack from "../../slack.app.mjs";

export default {
  key: "slack-add-emoji-reaction",
  name: "Add Emoji Reaction",
  description: "Add an emoji reaction to a message. [See the documentation](https://api.slack.com/methods/reactions.add)",
  version: "0.0.12",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      description: "Channel where the message to add reaction to was posted.",
    },
    timestamp: {
      propDefinition: [
        slack,
        "messageTs",
      ],
      description: "Timestamp of the message to add reaction to. e.g. `1403051575.000407`.",
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
  async run({ $ }) {
    const response = await this.slack.sdk().reactions.add({
      channel: this.conversation,
      timestamp: this.timestamp,
      name: this.icon_emoji,
    });
    $.export("$summary", `Successfully added ${this.icon_emoji} emoji reaction.`);
    return response;
  },
};
