import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "discord_webhook-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.3.1",
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

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessage({
        avatarURL,
        threadID,
        username,
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      });
      $.export("$summary", "Message sent successfully");
    } catch (err) {
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};
