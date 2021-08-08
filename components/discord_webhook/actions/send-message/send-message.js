const discordWebhook = require("../../discord_webhook.app.js");

module.exports = {
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.1.0",
  type: "action",
  props: {
    discordWebhook,
    message: {
      propDefinition: [
        discordWebhook,
        "message",
      ],
    },
    threadID: {
      propDefinition: [
        discordWebhook,
        "threadID",
      ],
    },
    username: {
      propDefinition: [
        discordWebhook,
        "username",
      ],
    },
    avatarURL: {
      propDefinition: [
        discordWebhook,
        "avatarURL",
      ],
    },
  },
  async run() {
    const {
      avatarURL,
      threadID,
      username,
    } = this;

    // No interesting data is returned from Discord
    await this.discordWebhook.sendMessage({
      avatarURL,
      content: this.message,
      threadID,
      username,
    });
  },
};
