import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-send-sms",
  name: "Send SMS",
  description: "Enables the user to send a short message service (SMS) globally through the CommPeak system.",
  version: "0.0.1",
  type: "action",
  props: {
    commpeak,
    recipients: {
      propDefinition: [
        commpeak,
        "recipients",
      ],
    },
    messageContent: {
      propDefinition: [
        commpeak,
        "messageContent",
      ],
    },
    scheduledTime: {
      propDefinition: [
        commpeak,
        "scheduledTime",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.commpeak.sendSMS({
      recipients: this.recipients,
      messageContent: this.messageContent,
      scheduledTime: this.scheduledTime,
    });
    $.export("$summary", "SMS successfully sent");
    return response;
  },
};
