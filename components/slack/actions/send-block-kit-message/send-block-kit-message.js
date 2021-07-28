const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-send-block-kit-message",
  name: "Send Message Using Block Kit",
  description: "Send a message using Slack's Block Kit UI framework to a channel, group or user",
  version: "0.1.0",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
      optional: false,
    },
    blocks: {
      propDefinition: [
        slack,
        "blocks",
      ],
      optional: false,
    },
    text: {
      propDefinition: [
        slack,
        "notificationText",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
    },
    username: {
      propDefinition: [
        slack,
        "username",
      ],
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().chat.postMessage({
      text: this.text,
      blocks: this.blocks,
      channel: this.conversation,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    });
  },
};
