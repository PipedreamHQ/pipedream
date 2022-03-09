import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.3.0",
  type: "action",
  props: {
    ...common.props,
  },
  async run({ $ }) {
    const {
      message,
      avatarURL,
      threadID,
      username,
      includeSentViaPipedream,
    } = this;

    let content = message;

    if (includeSentViaPipedream) {
      if (typeof content !== "string") {
        content = JSON.stringify(content);
      }
      content += `\n\n${this.getSentViaPipedreamText()}`;
    }

    const params = {
      avatarURL,
      content,
      threadID,
      username,
    };

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessage(params);
      $.export("$summary", "Message sent successfully");
    } catch (err) {
      $.export("$summary", `${err}`);
      $.export("unsent", params);
    }
  },
};
