import { axios } from "@pipedream/platform";
import sendsms from "../../sendsms.app.mjs";

export default {
  name: "Send Message",
  description: "This action sends an SMS message using the SendSMS.ro API.",
  key: "sendsms-send-message",
  version: "0.0.1",
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
      default: 19,
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
    let params = {
      username: this.sendsms.$auth.username,
      password: this.sendsms.$auth.api_key,
      to: this.to,
      text: this.text,
    };

    const properties = [
      "from",
      "report_mask",
      "report_url",
      "charset",
      "data_coding",
      "message_class",
      "auto_detect_encoding",
      "short",
      "ctype",
    ];

    properties.forEach((property) => {
      if (this[property] !== null) {
        params[property] = this[property];
      }
    });

    const response = await axios($, {
      url: "https://api.sendsms.ro/json?action=message_send",
      params: params,
    });
    $.export("$summary", `Successfully sent message to '${this.to}'`);
    return response;
  },
};
