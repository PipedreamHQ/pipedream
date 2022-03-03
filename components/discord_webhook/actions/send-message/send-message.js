const common = require("../send-message-common");

module.exports = {
  ...common,
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.2.0",
  type: "action",
  props: {
    ...common.props,
  },
  async run() {
    const {
      avatarURL,
      threadID,
      username,
      includeSendMessageViaPipedreamFlag,
    } = this;

    let embeds;
    if (includeSendMessageViaPipedreamFlag) {
      embeds = [
        ...(embeds ?? []),
        this.makeSentViaPipedreamEmbed(),
      ];
    }

    // No interesting data is returned from Discord
    await this.discordWebhook.sendMessage({
      avatarURL,
      content: this.message,
      threadID,
      username,
      embeds,
    });
  },
};
