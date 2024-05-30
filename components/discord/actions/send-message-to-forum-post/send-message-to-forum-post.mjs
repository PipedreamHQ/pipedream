import discord from "../../discord.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message-to-forum-post",
  name: "Send Message to Forum Post",
  description: "Send a simple message to a Discord forum. [See the documentation](https://discord.com/developers/docs/resources/channel#create-message)",
  version: "0.0.1",
  type: "action",
  props: {
    discord,
    postID: {
      type: "string",
      label: "Post ID",
      description: "The ID of a forum post",
    },
    message: {
      propDefinition: [
        discord,
        "message",
      ],
    },
    username: {
      propDefinition: [
        discord,
        "username",
      ],
    },
    avatarURL: {
      propDefinition: [
        discord,
        "avatarURL",
      ],
    },
    includeSentViaPipedream: {
      propDefinition: [
        discord,
        "includeSentViaPipedream",
      ],
    },
    suppressNotifications: {
      propDefinition: [
        discord,
        "suppressNotifications",
      ],
    },
  },
  async run({ $ }) {
    const {
      message,
      avatarURL,
      username,
      includeSentViaPipedream,
      suppressNotifications,
    } = this;
    try {
      const resp = await this.discord.sendMessage(this.postID, {
        avatar_url: avatarURL,
        username,
        flags: this.getMessageFlags(suppressNotifications),
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      }, {});
      $.export("$summary", "Message sent successfully");
      return resp || {
        success: true,
      };
    } catch (err) {
      console.log(err);
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};
