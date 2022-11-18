import app from "../../d7_networks.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Send SMS",
  version: "0.0.2",
  key: "d7_networks-send-sms",
  description: "Sending sms via D7 networks! [See the docs](https://d7networks.com/docs/Messages/Send_Message/)",
  type: "action",
  props: {
    app,
    originator: {
      type: "string",
      label: "Originator",
      description: "The Sender/Header of a message. Brand name with a maximum character limit of 11 or your mobile number with country code. E.g. `Pipedream`",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Mobile Numbers to send SMS.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the message.",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "Messaging Channel (`SMS`, `WhatsApp`, `Viber`, `Telegram`, etc)",
      options: [
        "SMS",
        "WhatsApp",
        "Viber",
        "Telegram",
      ],
      optional: true,
    },
    reportUrl: {
      type: "string",
      label: "Report URL",
      description: "Your call back server URL to recieve delivery status",
      default:"https://the_url_to_recieve_delivery_report.com",
      optional: true,
    },
    dataCoding: {
      type: "string",
      label: "Data Encoding",
      description: "Set as `text` for normal GSM 03.38 characters (English, normal characters). Set as `unicode` for non GSM 03.38 characters (Arabic, Chinese, Hebrew, Greek like regional languages and Unicode characters). Set as `auto` so we will find the data_coding based on your content.",
      options: [
        "text",
        "unicode",
        "auto",
      ],
      default: "text",
      optional: true,
    },
    msgType: {
      type: "string",
      label: "Message Type",
      description: "Set as `text` for normal GSM 03.38 characters (English, normal characters). Set as `unicode` for non GSM 03.38 characters (Arabic, Chinese, Hebrew, Greek like regional languages and Unicode characters). Set as `auto` so we will find the data_coding based on your content.",
      options: [
        "text",
        "audio",
        "sms",
        "multimedia",
        "image",
      ],
      default: "text",
      optional: true,
    },
  },
  methods: {
    sendSMS(args = {}) {
      return this.app.makeRequest({
        method: "post",
        path: `/messages/${constants.API_VERSION}/send`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      originator,
      recipients,
      content,
      channel,
      reportUrl,
      dataCoding,
      msgType,
    } = this;

    const response = await this.sendSMS({
      step,
      data: {
        messages: [
          {
            channel,
            recipients,
            content,
            msg_type: msgType,
            data_coding: dataCoding,
          },
        ],
        message_globals: {
          originator: originator,
          report_url: reportUrl,
        },
      },
    });

    step.export("$summary", `Successfully sent SMS with request ID ${response.request_id}`);

    return response;
  },
};