import common from "../common/common.mjs";
import discord from "../../discord.app.mjs";

export default {
  ...common,
  key: "discord-edit-message",
  name: "Edit Message",
  description: "Edit a message sent previously",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
    channel: {
      type: "$.discord.channel",
      appProp: "discord",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
    },
    includeSentViaPipedream: {
      propDefinition: [
        discord,
        "includeSentViaPipedream",
      ],
    },
    embeds: {
      propDefinition: [
        common.props.discord,
        "embeds",
      ],
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
      includeSentViaPipedream,
    } = this;

    try {
      const resp = await this.discord.editMessage(this.channel, this.messageId, {
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      }, {
        wait: true,
      });
      $.export("$summary", "Message edited successfully");
      return resp || {
        success: true,
      };
    } catch (err) {
      console.log(err);
      const unsentMessage = this.getUserInputProps();
      $.export("not edited", unsentMessage);
      throw err;
    }
  },
};
