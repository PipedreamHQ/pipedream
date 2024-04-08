import sendsms from "../../sendsms.app.mjs";

export default {
  name: "Send Message with Unsubscribe Link",
  description: "This action sends an SMS message with an unsubscribe link using the SendSMS.ro API. [See the documentation](https://www.sendsms.ro/api/?shell#send-message-with-unsubscribe-link)",
  key: "sendsms-send-message-with-unsubscribe-link",
  version: "0.0.2",
  type: "action",
  props: {
    sendsms,
    to: {
      type: "string",
      label: "To",
      description: "The recipient phone number.",
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
    report_mask: {
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
      report_mask,
      ...params
    } = this;

    const totalMask = report_mask?.length
      ? report_mask.reduce((partialSum, a) => partialSum + a, 0)
      : null;

    const response = await sendsms.sendSmsGDPR({
      $,
      params: {
        ...params,
        report_mask: totalMask,
      },
    });

    if (response.status == 1) {
      $.export("$summary", `Successfully sent message to '${this.to}'`);
    }

    if (response.status < 0) {
      console.error(response);
      throw new Error(response.message);
    }

    return response;
  },
};
