import sendsms from "../../sendsms.app.mjs";

export default {
  key: "sendsms-send-sms",
  name: "Send SMS",
  description: "Send a singular SMS to your customers. [See the documentation](https://www.sendsms.ro/api/)",
  version: "0.0.1",
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
      description: "The content of the SMS message.",
    },
    from: {
      type: "string",
      label: "From",
      description: "Sending label.",
      optional: true,
    },
    reportUrl: {
      type: "string",
      label: "Report URL",
      description: "The HTTP URL for us to request when the status changes.",
      optional: true,
    },
    reportMask: {
      type: "integer[]",
      label: "Report Mask",
      description: "Select which status messages you would like to receive",
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
  },
  async run({ $ }) {
    const totalMask = this.reportMask?.length
      ? this.reportMask.reduce((partialSum, a) => partialSum + a, 0)
      : null;
    const response = await this.sendsms.sendSms({
      $,
      params: {
        to: this.to,
        text: this.text,
        from: this.from,
        report_url: this.reportUrl,
        report_mask: totalMask,
      },
    });

    $.export("$summary", `SMS sent successfully with Id: ${response.details}`);
    return response;
  },
};
