import acumbamail from "../../acumbamail.app.mjs";

export default {
  key: "acumbamail-send-sms",
  name: "Send SMS",
  description: "Send an SMS to a subscriber. [See the documentation](https://acumbamail.com/en/apidoc/function/sendSMS/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    acumbamail,
    recipient: {
      type: "string",
      label: "Recipient",
      description: "The phone number of the recipient. Example: `+1234567890`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send`",
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The name of the sender",
    },
  },
  async run({ $ }) {
    const response = await this.acumbamail.sendSMS({
      $,
      data: {
        messages: [
          {
            recipient: this.recipient,
            body: this.message,
            sender: this.sender,
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent SMS to ${this.recipient}`);
    return response;
  },
};
