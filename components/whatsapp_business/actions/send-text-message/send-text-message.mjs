import whatsapp from "../../whatsapp_business.app.mjs";

export default {
  key: "whatsapp_business-send-text-message",
  name: "Send Text Message",
  description: "Sends a text message",
  version: "0.0.1",
  type: "action",
  props: {
    whatsapp,
    phoneNumberId: {
      propDefinition: [
        whatsapp,
        "phoneNumberId",
      ],
    },
    recipientPhoneNumber: {
      type: "string",
      label: "Recipient Phone Number",
      description: "Enter the recipient's 10 digit phone number (for example, `15101234567`)",
    },
    messageBody: {
      type: "string",
      label: "Message Body",
      description: "The content of the message",
    },
  },
  async run({ $ }) {
    const response = await this.whatsapp.sendMessage({
      $,
      phoneNumberId: this.phoneNumberId,
      to: this.recipientPhoneNumber,
      body: this.messageBody,
    });
    $.export("$summary", `Sent message successfully to +${this.recipientPhoneNumber}`);
    return response;
  },
};
