import rocketchat from "../../rocketchat.app.mjs";

export default {
  key: "rocketchat-send-direct-message",
  name: "Send Direct Message",
  description: "Sends a new direct message to a specific user using the recipient's username and a text.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rocketchat,
    recipientUsername: {
      type: "string",
      label: "Recipient Username",
      description: "The username of the recipient for the direct message",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to be sent",
    },
  },
  async run({ $ }) {
    const response = await this.rocketchat.sendMessage({
      recipientUsername: this.recipientUsername,
      text: this.text,
    });
    $.export("$summary", `Successfully sent message to ${this.recipientUsername}`);
    return response;
  },
};
