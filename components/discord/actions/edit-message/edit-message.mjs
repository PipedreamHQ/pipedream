import common from "../common/common.mjs";
import discord from "../../discord.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

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
    messageId: {
      label: "Message ID",
      description: "The ID of the message you want to edit.",
      type: "string",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
      optional: true,
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
  },
  async run({ $ }) {
    const {
      message,
      includeSentViaPipedream,
      embeds,
    } = this;

    if (!message && !embeds) {
      throw new ConfigurationError("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
    }

    let content = message;
    if (includeSentViaPipedream) {
      if (embeds?.length) {
        embeds.push({
          "color": 16777215,
          "description": this.getSentViaPipedreamText(),
        });
      } else {
        content = this.appendPipedreamText(message ?? "");
      }
    }

    try {
      const resp = await this.discord.editMessage(this.channel, this.messageId, {
        content,
        embeds,
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
