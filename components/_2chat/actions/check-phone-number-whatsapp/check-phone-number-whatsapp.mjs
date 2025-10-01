import twoChat from "../../_2chat.app.mjs";

export default {
  key: "_2chat-check-phone-number-whatsapp",
  name: "Check Phone Number for WhatsApp",
  description: "Checks if a given phone number has a WhatsApp account. [See the documentation](https://developers.2chat.co/docs/API/WhatsApp/check-number)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twoChat,
    fromNumber: {
      propDefinition: [
        twoChat,
        "fromNumber",
      ],
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to check for a WhatsApp account. Example: `+12121112222`",
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.checkWhatsAppAccount({
      $,
      fromNumber: this.fromNumber,
      numberToCheck: this.phoneNumber,
    });
    $.export("$summary", `Checked phone number ${this.phoneNumber} for WhatsApp account`);
    return response;
  },
};
