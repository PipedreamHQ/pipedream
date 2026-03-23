import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-send-sms",
  name: "Send SMS",
  description: "Send an SMS via the Messaging API (charges may apply). [See the documentation](https://developer.servicem8.com/reference/send_sms)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    to: {
      type: "string",
      label: "To",
      description: "Recipient phone number in E.164 format (e.g. +61412345678)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "SMS body (max 1600 characters)",
    },
    regardingJobUUID: {
      type: "string",
      label: "Regarding Job UUID",
      description: "Optional job UUID to link the SMS to the job diary",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      to: this.to,
      message: this.message,
    };
    const regardingJob = this.regardingJobUUID;
    if (
      regardingJob !== undefined &&
      regardingJob !== null &&
      String(regardingJob).trim() !== ""
    ) {
      data.regardingJobUUID = String(regardingJob).trim();
    }
    const response = await this.servicem8.sendSms({
      $,
      data,
    });
    const digits = String(this.to).replace(/\D/g, "");
    const tail = digits.length >= 4
      ? digits.slice(-4)
      : "****";
    $.export("$summary", `SMS submitted to ServiceM8 (recipient …${tail})`);
    return response;
  },
};
