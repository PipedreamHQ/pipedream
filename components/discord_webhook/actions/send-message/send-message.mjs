import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.2.1",
  type: "action",
  props: {
    ...common.props,
  },
  async run() {
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

    // No interesting data is returned from Discord
    await this.discordWebhook.sendMessage({
      avatarURL,
      content,
      threadID,
      username,
    });
  },
};
