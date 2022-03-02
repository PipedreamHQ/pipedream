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
    include_sent_via_pipedream_flag: {
      type: "boolean",
      optional: true,
      default: true,
      label: "Include link to workflow",
      description: "Defaults to `true`, includes a link to the workflow at the end of your Discord message.",
    },
  },
  async run() {
    let content = this.message;

    let link = `https://pipedream.com/@/${process.env.PIPEDREAM_WORKFLOW_ID}`;
    link += `/inspect/${process.env.PIPEDREAM_TRACE_ID}`;
    link += "?origin=action";
    link += "&a=discord_webhook";

    const sentViaPipedreamText = `\n\n*Sent via [Pipedream](<${link}>)*`;

    if (this.include_sent_via_pipedream_flag == true) {
      content = `${this.message}${sentViaPipedreamText}`;
    }

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
