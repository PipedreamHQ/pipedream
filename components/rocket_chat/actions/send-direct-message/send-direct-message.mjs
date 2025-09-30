import rocketchat from "../../rocket_chat.app.mjs";

export default {
  key: "rocket_chat-send-direct-message",
  name: "Send Direct Message",
  description: "Sends a new direct message to a specific user. [See the documentation](https://developer.rocket.chat/reference/api/rest-api/endpoints/messaging/chat-endpoints/postmessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rocketchat,
    username: {
      propDefinition: [
        rocketchat,
        "username",
      ],
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to be sent",
    },
  },
  async run({ $ }) {
    const response = await this.rocketchat.sendMessage({
      $,
      data: {
        channel: `@${this.username}`,
        text: this.text,
      },
    });
    $.export("$summary", `Successfully sent message to ${this.recipientUsername}`);
    return response;
  },
};
