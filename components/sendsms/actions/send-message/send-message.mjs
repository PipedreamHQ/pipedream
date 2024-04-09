import sendsms from "../../sendsms.app.mjs";

export default {
  name: "Send Message",
  description: "This action sends an SMS message using the SendSMS.ro API. [See the documentation](https://www.sendsms.ro/api/#send-message)",
  key: "sendsms-send-message",
  version: "0.0.2",
  type: "action",
  props: {
    sendsms,
    to: {
      type: "string",
      label: "To",
      description: "The phone number to send the SMS to, in E.164 format without the + sign (e.g., 40727363767).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text message to send.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender ID that appears on the recipient's device.",
      optional: true,
    },
    reportMask: {
      type: "integer",
      label: "Report Mask",
      description: "Reporting options for delivery status.",
      optional: true,
      options: [
        {
          label: "Delivered",
          value: 1,
        },
        {
          label: "Undelivered",
          value: 2,
        },
        {
          label: "Queued at network",
          value: 4,
        },
        {
          label: "Sent to network",
          value: 8,
        },
        {
          label: "Failed at network",
          value: 16,
        },
      ],
    },
    report_url: {
      type: "string",
      label: "Report URL",
      description: "The URL to send delivery reports to.",
      optional: true,
    },
    charset: {
      type: "string",
      label: "Charset",
      description: "Character encoding for the text message.",
      optional: true,
      default: "UTF-8",
    },
    data_coding: {
      type: "string",
      label: "Data Coding",
      description: "The encoding scheme of the message text.",
      optional: true,
    },
    message_class: {
      type: "string",
      label: "Message Class",
      description: "Class of the SMS message.",
      optional: true,
    },
    auto_detect_encoding: {
      type: "integer",
      label: "Auto Detect Encoding",
      description: "Automatically detect text encoding.",
      optional: true,
    },
    short: {
      type: "boolean",
      label: "Short",
      description: "Use short encoding if possible.",
      optional: true,
    },
    ctype: {
      type: "integer",
      label: "CType",
      description: "Type of the content.",
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    const {
      sendsms,
      reportMask,
      ...params
    } = this;

    const totalMask = reportMask?.length
      ? reportMask.reduce((partialSum, a) => partialSum + a, 0)
      : null;

    const response = await sendsms.sendSms({
      $,
      params: {
        ...params,
        report_mask: totalMask,
      },
    });

    if (response.status < 0) {
      throw new Error(response.message);
    }

    $.export("$summary", `Successfully sent message to '${this.to}'`);
    return response;
  },
};
