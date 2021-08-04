const discordWebhook = require("../../discord_webhook.app.js");
const axios = require("axios");

module.exports = {
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel.",
  version: "0.0.12",
  type: "action",
  props: {
    discordWebhook,
    message: {
      propDefinition: [
        discordWebhook,
        "message",
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
      username,
      avatar_url,
    } = this;

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
