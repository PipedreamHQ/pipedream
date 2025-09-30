import smsapi from "../../smsapi.app.mjs";

export default {
  key: "smsapi-send-text-message",
  name: "Send Text Message",
  description: "Sends a text message using SMSAPI. [See the documentation](https://www.smsapi.com/docs/#2-single-sms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsapi,
    to: {
      propDefinition: [
        smsapi,
        "phoneNumber",
      ],
    },
    from: {
      propDefinition: [
        smsapi,
        "senderName",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message text",
    },
  },
  async run({ $ }) {
    const response = await this.smsapi.sendMessage({
      data: {
        to: this.to,
        from: this.from,
        message: this.message,
      },
      $,
    });

    if (response?.includes("OK")) {
      $.export("$summary", "Successfully sent text message.");
    } else {
      throw new Error(`${response}, See Error Code Descriptions - https://www.smsapi.com/docs/#18-error-codes`);
    }

    return response;
  },
};
