const common = require("../send-message-common");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  ...common,
  key: "discord_webhook-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "0.0.1",
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
      includeSendMessageViaPipedreamFlag,
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

    let embeds;
    if (includeSendMessageViaPipedreamFlag) {
      embeds = [
        ...(embeds ?? []),
        this.makeSentViaPipedreamEmbed(),
      ];
    }

    // No interesting data is returned from Discord
    const resp = await this.discordWebhook.sendMessageWithFile({
      content,
      avatarURL,
      threadID,
      username,
      file,
      embeds,
    });

    $.export("$summary", "Message sent successfully");

    return resp;
  },
};
