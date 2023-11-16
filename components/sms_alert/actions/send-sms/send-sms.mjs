import sms_alert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-send-sms",
  name: "Send SMS",
  description: "Sends a text message directly. [See the documentation](https://kb.smsalert.co.in/developers-api/)",
  version: "0.0.1",
  type: "action",
  props: {
    sms_alert,
    senderId: {
      propDefinition: [
        sms_alert,
        "senderId",
      ],
    },
    mobileNumber: {
      propDefinition: [
        sms_alert,
        "mobileNumber",
      ],
    },
    messageText: {
      propDefinition: [
        sms_alert,
        "messageText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sms_alert.sendSMS({
      senderId: this.senderId,
      mobileNumber: this.mobileNumber,
      messageText: this.messageText,
    });

    $.export("$summary", `Sent message to ${this.mobileNumber} successfully`);
    return response;
  },
};
