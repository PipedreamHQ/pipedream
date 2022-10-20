import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message-advanced",
  name: "Send Message (Advanced)",
  description: "Send a simple or structured message (using embeds) to a Discord channel",
  version: "1.0.0",
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
      avatarURL,
      threadID,
      username,
      includeSentViaPipedream,
      embeds: embedsProp,
    } = this;
    let embeds = embedsProp;

    if (!message && !embeds) {
      throw new Error("This action requires at least 1 message OR embeds object. Please enter one or the other above.");
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
      const resp = await this.discord.sendMessage(this.channel, {
        avatar_url: avatarURL,
        username,
        embeds,
        content,
      }, {
        thread_id: threadID,
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
