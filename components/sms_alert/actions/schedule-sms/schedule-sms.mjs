import smsAlert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-schedule-sms",
  name: "Schedule SMS",
  description: "Schedules a text message to be sent at a specified time. [See the documentation](https://kb.smsalert.co.in/developers-api/#Schedule-a-SMS)",
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
    scheduleTime: {
      propDefinition: [
        smsAlert,
        "scheduleTime",
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
        schedule: this.scheduleTime,
      },
    });

    $.export("$summary", `Scheduled SMS successfully for ${this.scheduleTime}`);
    return response;
  },
};
