import sms_alert from "../../sms_alert.app.mjs";

export default {
  key: "sms_alert-schedule-sms",
  name: "Schedule SMS",
  description: "Schedules a text message to be sent at a specified time. [See the documentation](https://kb.smsalert.co.in/knowledgebase/sms-alert-developers-api/)",
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
    scheduleTime: {
      propDefinition: [
        sms_alert,
        "scheduleTime",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sms_alert.scheduleSMS({
      senderId: this.senderId,
      mobileNumber: this.mobileNumber,
      messageText: this.messageText,
      scheduleTime: this.scheduleTime,
    });

    $.export("$summary", `Scheduled SMS successfully for ${this.scheduleTime}`);
    return response;
  },
};
