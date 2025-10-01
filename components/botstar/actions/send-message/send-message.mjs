import botstar from "../../botstar.app.mjs";

export default {
  key: "botstar-send-message",
  name: "Send Message",
  description: "Send a message to a user via BotStar. [See the docs](https://apis.botstar.com/docs/#/Messages/post_messages)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    botstar,
    recipientId: {
      type: "string",
      label: "Recipient ID",
      description: "The user ID to send the message to. To find a user ID, login to app.botstar.com > Report & Insight > Audience > click on a chat user The User ID is displayed under the information on the left of the screen",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text message to send",
    },
  },
  async run({ $ }) {
    const response = await this.botstar.sendMessage({
      $,
      data: {
        recipient: {
          id: this.recipientId,
        },
        message: {
          text: this.message,
        },
      },
    });
    $.export("$summary", `Sent message to user ${this.recipientId}`);
    return response;
  },
};
