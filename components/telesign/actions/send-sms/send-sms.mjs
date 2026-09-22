import app from "../../telesign.app.mjs";

export default {
  key: "telesign-send-sms",
  name: "Send SMS",
  description: "Sends a text message to a provided phone number. [See the documentation](https://developer.telesign.com/enterprise/docs/sms-get-started)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "To Phone Number",
      description: "The phone number to receive the SMS message in E.164 format (e.g., `+15555551212`)",
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    messageType: {
      propDefinition: [
        app,
        "messageType",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      phoneNumber,
      message,
      messageType,
    } = this;

    const response = await app.sendSms({
      $,
      data: {
        phone_number: phoneNumber,
        message,
        message_type: messageType,
      },
    });

    $.export("$summary", "Successfully sent SMS.");
    return response;
  },
};
