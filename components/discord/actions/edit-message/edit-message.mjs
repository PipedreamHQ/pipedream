import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-edit-message",
  name: "Edit Message",
  description: "Edit a message sent previously",
  version: "0.0.1",
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
      const resp = await this.discord.editMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message)
          : message,
      }, {
        thread_id: threadID,
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
