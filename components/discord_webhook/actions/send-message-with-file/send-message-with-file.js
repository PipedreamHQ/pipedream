const discordWebhook = require("../../discord_webhook.app.js");
var request = require("request");
const fs = require("fs");

module.exports = {
  key: "discord_webhook-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "0.0.1",
  type: "action",
  props: {
    discordWebhook,
    message: {
      propDefinition: [
        discordWebhook,
        "message",
      ],
    },
    threadID: {
      propDefinition: [
        discordWebhook,
        "threadID",
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
    fileUrl: {
      type: "string",
      label: "File URL",
      description:
        "The URL of the file to attach. Must specify either File URL or File Path.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description:
        "The path to the file, e.g. /tmp/myFile.csv . Must specify either File URL or File Path.",
      optional: true,
    },
  },
  async run() {
    const {
      message: content,
      avatarURL,
      threadID,
      username,
    } = this;

    const file = this.fileUrl
      ? request.get(this.fileUrl)
      : fs.createReadStream(this.filePath);

    // No interesting data is returned from Discord
    await this.discordWebhook.sendMessageWithFile({
      content,
      avatarURL,
      threadID,
      username,
      file,
    });
  },
};
