const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-send-group-message",
  name: "Send Group Message",
  description: "Send a direct message to a group of users",
  version: "0.1.0",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "user",
      ],
    },
    text: {
      propDefinition: [
        slack,
        "text",
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
      description: "Optionally customize your bot's username (default is `Pipedream`).",
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
      description: "Optionally use an emoji as the bot icon for this message (e.g., `:fire:`). This value overrides `icon_url` if both are provided.",
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
      description: "Optionally provide an image URL to use as the bot icon for this message.",
    },
  },
  async run() {
    return await this.slack.sdk().chat.postMessage({
      channel: this.conversation,
      text: this.text,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    });
  },
};
