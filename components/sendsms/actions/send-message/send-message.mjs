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
      propDefinition: [
        sendsms,
        "to",
      ],
    },
    text: {
      propDefinition: [
        sendsms,
        "text",
      ],
    },
    from: {
      propDefinition: [
        sendsms,
        "from",
      ],
      optional: true,
    },
    reportMask: {
      propDefinition: [
        sendsms,
        "reportMask",
      ],
      optional: true,
    },
    report_url: {
      propDefinition: [
        sendsms,
        "report_url",
      ],
      optional: true,
    },
    charset: {
      propDefinition: [
        sendsms,
        "charset",
      ],
      optional: true,
    },
    data_coding: {
      propDefinition: [
        sendsms,
        "data_coding",
      ],
      optional: true,
    },
    message_class: {
      propDefinition: [
        sendsms,
        "message_class",
      ],
      optional: true,
    },
    auto_detect_encoding: {
      propDefinition: [
        sendsms,
        "auto_detect_encoding",
      ],
      optional: true,
    },
    short: {
      propDefinition: [
        sendsms,
        "short",
      ],
      optional: true,
    },
    ctype: {
      propDefinition: [
        sendsms,
        "ctype",
      ],
      optional: true,
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
