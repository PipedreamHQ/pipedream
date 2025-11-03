import smsAlert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-send-sms",
  name: "Send SMS",
  description: "Sends a text message directly. [See the documentation](https://kb.smsalert.co.in/developers-api/#Send-a-SMS)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsAlert,
    senderId: {
      propDefinition: [
        smsAlert,
        "senderId",
      ],
    },
    mobileNumber: {
      propDefinition: [
        smsAlert,
        "mobileNumber",
      ],
    },
    messageText: {
      propDefinition: [
        smsAlert,
        "messageText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smsAlert.sendSMS({
      $,
      params: {
        sender: this.senderId,
        mobileno: this.mobileNumber.join(),
        text: this.messageText,
      },
    });

    $.export("$summary", `Sent message to ${this.mobileNumber} successfully`);
    return response;
  },
};
