import discord from "../../discord_bot.app.mjs";
import utils from "../../utils.mjs";

export default {
  key: "discord_bot-create-message",
  name: "Create Message",
  description: "Create a new message, can be used with `Create DM action`. [See the docs here](https://discord.com/developers/docs/resources/channel#create-message)",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
    channelId: {
      label: "Channel ID",
      description: "DM or group channel ID. For example, id field of Create DM action return value", //I could not find a way to list DM channels
      type: "string",
    },
    textContent: {
      label: "Text Content",
      description: "Message contents (up to 2000 characters)",
      type: "string",
    },
    embeds: {
      label: "Embeds",
      description: "Embedded rich content (up to 6000 characters), this should be given as an array, e.g. `[{\"title\": \"Hello, Embed!\",\"description\": \"This is an embedded message.\"}]`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.discord.createMessage({
      $,
      channelId: this.channelId,
      data: {
        content: this.textContent,
        embeds: utils.parseObject(this.embeds),
      },
    });

    return response;
  },
};
