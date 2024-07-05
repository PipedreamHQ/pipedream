import twoChat from "../../_2chat.app.mjs";

export default {
  key: "_2chat-send-whatsapp-text-message",
  name: "Send Whatsapp Text Message",
  description: "Sends a text message to a designated whatsapp-enabled phone number. [See the documentation](https://developers.2chat.co/docs/API/WhatsApp/send-message)",
  version: "0.0.1",
  type: "action",
  props: {
    twoChat,
    fromNumber: {
      propDefinition: [
        twoChat,
        "fromNumber",
      ],
    },
    toNumber: {
      type: "string",
      label: "Phone",
      description: "The number you want to send your message to. Example: `+12121112222`",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The content of the message you want to send",
    },
  },
  async run({ $ }) {
    const response = await this.twoChat.sendMessage({
      $,
      data: {
        from_number: this.fromNumber,
        to_number: this.toNumber,
        text: this.text,
      },
    });
    $.export("$summary", `Successfully sent message to ${this.toNumber}`);
    return response;
  },
};
