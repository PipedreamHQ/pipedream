const discordWebhook = require("../../discord_webhook.app.js");
const axios = require("axios");
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
      optional: true,
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
        "The URL of the file to attach. Must specify either **File URL** or **File Path**.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description:
        "The path to the file, e.g. `/tmp/myFile.csv`. Must specify either **File URL** or **File Path**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      message: content,
      avatarURL,
      threadID,
      username,
      fileUrl,
      filePath,
    } = this;

    if (!fileUrl && !filePath) {
      throw new Error("This action requires either File URL or File Path. Please enter one or the other above.");
    }

    const file = fileUrl
      ? (await axios({
        method: "get",
        url: fileUrl,
        responseType: "stream",
      })).data
      : fs.createReadStream(filePath);

    // No interesting data is returned from Discord
    const resp = await this.discordWebhook.sendMessageWithFile({
      content,
      avatarURL,
      threadID,
      username,
      file,
    });

    $.export("$summary", "Message sent successfully");

    return resp;
  },
};
