const discordWebhook = require("../../discord_webhook.app.js");

module.exports = {
  key: "discord_webhook-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Send a simple or structured message (using embeds) to a Discord channel",
  version: "0.1.4",
  type: "action",
  props: {
    discordWebhook,
    message: {
      propDefinition: [
        discordWebhook,
        "message",
      ],
      optional: true,
    },
    threadID: {
      propDefinition: [
        discordWebhook,
        "threadID",
      ],
    },
    embeds: {
      propDefinition: [
        discordWebhook,
        "embeds",
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
    const content = this.message;
    const {
      avatarURL,
      embeds,
      threadID,
      username,
    } = this;

    if (!content && !embeds) {
      throw new Error("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
    }

    // No interesting data is returned from Discord
    await this.discordWebhook.sendMessage({
      avatarURL,
      embeds,
      content,
      threadID,
      username,
    });
  },
};
