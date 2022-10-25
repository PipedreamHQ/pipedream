import common from "../common-send-message.mjs";
import axios from "axios";
import fs from "fs";

export default {
  ...common,
  key: "discord_webhook-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "0.2.2",
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
      message,
      avatarURL,
      threadID,
      username,
      fileUrl,
      filePath,
      includeSentViaPipedream,
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

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessageWithFile({
        avatarURL,
        threadID,
        username,
        file,
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message ?? "")
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
