import twoChat from "../../2chat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "2chat-check-phone-number-whatsapp",
  name: "Check Phone Number for WhatsApp",
  description: "Checks if a given phone number has a WhatsApp account. [See the documentation](https://developers.2chat.co/docs/intro)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    twoChat,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to check for a WhatsApp account",
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.checkWhatsAppAccount(this.phoneNumber);
    $.export("$summary", `Checked phone number ${this.phoneNumber} for WhatsApp account`);
    return response;
  },
};
