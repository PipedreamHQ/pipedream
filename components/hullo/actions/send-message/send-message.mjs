import hullo from "../../hullo.app.mjs";

export default {
  key: "hullo-send-message",
  name: "Send Message",
  description: "Sends a personalized message to a Hullo member.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hullo,
    memberId: {
      propDefinition: [
        hullo,
        "memberId",
      ],
    },
    messageContent: {
      propDefinition: [
        hullo,
        "messageContent",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hullo.sendMessage(this.memberId, this.messageContent);
    $.export("$summary", `Successfully sent message to member with ID: ${this.memberId}`);
    return response;
  },
};
