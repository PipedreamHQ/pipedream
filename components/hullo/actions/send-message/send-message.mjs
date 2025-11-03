import hullo from "../../hullo.app.mjs";

export default {
  key: "hullo-send-message",
  name: "Send Message",
  description: "Sends a personalized message to a Hullo member. [See the documentation](https://app.hullo.me/docs/index.html#?route=post-/endpoints/messages)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hullo,
    phoneNumber: {
      propDefinition: [
        hullo,
        "phoneNumber",
      ],
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The message text to send. Min length: 1, Max length: 640",
    },
  },
  async run({ $ }) {
    const response = await this.hullo.sendMessage({
      $,
      data: {
        phoneNumber: this.phoneNumber,
        messageText: this.messageText,
      },
    });
    $.export("$summary", `Successfully sent message to member with phone number: ${this.phoneNumber}`);
    return response;
  },
};
