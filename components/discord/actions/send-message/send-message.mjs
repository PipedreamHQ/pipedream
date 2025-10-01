import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "1.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const {
      message,
      avatarURL,
      threadID,
      username,
      includeSentViaPipedream,
      suppressNotifications,
    } = this;
    try {
      const resp = await this.discord.sendMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        flags: this.getMessageFlags(suppressNotifications),
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      }, {
        thread_id: threadID,
      });
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
