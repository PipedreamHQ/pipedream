import smstools from "../../smstools.app.mjs";

export default {
  key: "smstools-send-sms",
  name: "Send SMS or WhatsApp Message",
  description: "Sends a SMS or WhatsApp message to a specified contact. [See the documentation](https://www.smstools.com/en/sms-gateway-api/send_message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smstools,
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent.",
    },
    to: {
      propDefinition: [
        smstools,
        "contactNumber",
      ],
      type: "string[]",
      description: "The contact(s) to send the message to.",
    },
    sender: {
      propDefinition: [
        smstools,
        "sender",
      ],
    },
    date: {
      type: "string",
      label: "Scheduled Date",
      description: "The date to send the message. **Format: yyyy-MM-dd HH:mm**. If not provided, the message will be sent as soon as possible.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference for the message.",
      optional: true,
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Test mode for the message.",
      optional: true,
    },
    subId: {
      propDefinition: [
        smstools,
        "subId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smstools.sendMessage({
      $,
      data: {
        message: this.message,
        to: this.to,
        sender: this.sender,
        date: this.date,
        reference: this.reference,
        test: this.test,
        subId: this.subId,
      },
    });
    $.export("$summary", `Message sent successfully with ID: ${response.messageid}`);
    return response;
  },
};
