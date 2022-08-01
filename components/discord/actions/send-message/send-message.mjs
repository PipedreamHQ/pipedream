import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message",
  name: "Send Message",
  description: "Send a simple message to a Discord channel",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const {
      message,
      includeSentViaPipedream,
    } = this;

    try {
      const resp = await this.discord.createMessage(this.channel, {
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
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
