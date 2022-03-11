import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "discord_webhook-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Send a simple or structured message (using embeds) to a Discord channel",
  version: "0.3.0",
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.discordWebhook,
        "message",
      ],
      optional: true,
    },
    embeds: {
      propDefinition: [
        common.props.discordWebhook,
        "embeds",
      ],
    },
  },
  async run({ $ }) {
    const {
      message,
      avatarURL,
      threadID,
      username,
      includeSentViaPipedream,
      embeds,
    } = this;

    if (!message && !embeds) {
      throw new Error("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
    }

    const params = {
      avatarURL,
      embeds,
      message,
      threadID,
      username,
      includeSentViaPipedream,
    };

    let content = message ?? "";

    if (includeSentViaPipedream) {
      if (typeof content !== "string") {
        content = JSON.stringify(content);
      }
      content += `\n\n${this.getSentViaPipedreamText()}`;
    }

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessage({
        ...params,
        content,
      });
      $.export("$summary", "Message sent successfully");
    } catch (err) {
      $.export("unsent", params);
      throw err;
    }
  },
};
