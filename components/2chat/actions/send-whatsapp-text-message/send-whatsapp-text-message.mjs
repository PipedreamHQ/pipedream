import twoChat from "../../2chat.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "2chat-send-whatsapp-text-message",
  name: "Send Whatsapp Text Message",
  description: "Sends a text message to a designated whatsapp-enabled phone number",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    twoChat,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The Whatsapp-enabled phone number to send the message to",
    },
    textMessage: {
      type: "string",
      label: "Text Message",
      description: "The content of the text message to be sent",
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.sendMessage(this.phoneNumber, this.textMessage);
    $.export("$summary", `Successfully sent message to ${this.phoneNumber}`);
    return response;
  },
};
