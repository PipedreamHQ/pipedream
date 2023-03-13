import common from "../common/common.mjs";
import axios from "axios";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "discord-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "1.0.1",
  type: "action",
  props: {
    ...common.props,
    message: {
      propDefinition: [
        common.props.discord,
        "message",
      ],
      optional: true,
    },
    fileUrl: {
      propDefinition: [
        common.props.discord,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        common.props.discord,
        "filePath",
      ],
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
      throw new ConfigurationError("This action requires either File URL or File Path. Please enter one or the other above.");
    }

    const file = fileUrl
      ? (await axios({
        method: "get",
        url: fileUrl,
        responseType: "stream",
      })).data
      : fs.createReadStream(filePath);

    try {
      const resp = await this.discord.sendMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        file,
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message ?? "")
          : message,
      }, {
        thread_id: threadID,
        wait: true,
      });
      $.export("$summary", "Message sent successfully");
      return resp || {
        success: true,
      };
    } catch (err) {
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};
