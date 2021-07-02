const discordWebhook = require("../../discord_webhook.app.js");
const axios = require("axios");

module.exports = {
  key: "discord_webhook-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Send a simple or structured message (using embeds) to a Discord channel.",
  version: "0.0.3",
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
    avatar_url: {
      propDefinition: [
        discordWebhook,
        "avatar_url",
      ],
    },
  },
  async run() {
    const url = this.discordWebhook.$auth.oauth_uid;
    let content = this.message;
    const {
      embeds,
      username,
      avatar_url,
    } = this;

    if (!content && !embeds) {
      throw new Error("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
    }

    return (await axios({
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        content,
        embeds,
        username,
        avatar_url,
      },
    })).data;
  },
};
