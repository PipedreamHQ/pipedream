import common from "../send-message-common.mjs";

export default {
  ...common,
  key: "discord_webhook-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Send a simple or structured message (using embeds) to a Discord channel",
  version: "0.2.0",
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
  async run() {
    const {
      message: content,
      avatarURL,
      threadID,
      username,
      includeSendMessageViaPipedreamFlag,
    } = this;
    let { embeds } = this;

    if (!content && !embeds) {
      throw new Error("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
    }

    if (includeSendMessageViaPipedreamFlag) {
      embeds = [
        ...(embeds ?? []),
        this.makeSentViaPipedreamEmbed(),
      ];
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
