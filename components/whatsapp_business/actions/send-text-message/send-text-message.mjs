import whatsapp from "../../whatsapp_business.app.mjs";

const docLink = "https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages";

export default {
  key: "whatsapp_business-send-text-message",
  name: "Send Text Message",
  description: `Sends a text message. [See the docs.](${docLink})`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        whatsapp,
        "recipientPhoneNumber",
      ],
    },
    messageBody: {
      type: "string",
      label: "Message Body",
      description: "The text content of the message.",
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
