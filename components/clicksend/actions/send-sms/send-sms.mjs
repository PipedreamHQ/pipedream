import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-send-sms",
  name: "Send SMS",
  description: "Sends a new SMS to a specified recipient using ClickSend",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clicksend,
    destinationNumber: {
      propDefinition: [
        clicksend,
        "destinationNumber",
      ],
    },
    messageContent: {
      propDefinition: [
        clicksend,
        "messageContent",
      ],
    },
    senderId: {
      propDefinition: [
        clicksend,
        "senderId",
      ],
      optional: true,
    },
    sendingSpeed: {
      propDefinition: [
        clicksend,
        "sendingSpeed",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clicksend.sendSMS({
      destinationNumber: this.destinationNumber,
      messageContent: this.messageContent,
      senderId: this.senderId,
      sendingSpeed: this.sendingSpeed,
    });
    $.export("$summary", "Successfully sent SMS");
    return response;
  },
};
