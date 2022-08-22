import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord-send-message-with-file",
  name: "Send Message With File",
  description: "Post a message with an attached file",
  version: "0.0.1",
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
      type: "string",
      label: "File URL",
      description: "The URL of the file to attach",
    },
  },
  async run({ $ }) {
    const {
      message,
      fileUrl,
      includeSentViaPipedream,
    } = this;

    try {
      const resp = await this.discord.createMessage(this.channel, {
        files: [
          {
            attachment: fileUrl,
          },
        ],
        content: includeSentViaPipedream
          ? this.appendPipedreamText(message ?? "")
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
