import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "1.0.0",
  type: "action",
  async run({ $ }) {
    const {
      message,
      avatarURL,
      threadID,
      username,
      includeSentViaPipedream,
    } = this;

    try {
      const resp = await this.discord.sendMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      }, {
        thread_id: threadID,
      });
      $.export("$summary", "Message sent successfully");
      return resp;
    } catch (err) {
      const unsentMessage = this.getUserInputProps();
      $.export("unsent", unsentMessage);
      throw err;
    }
  },
};
