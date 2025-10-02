import textlocal from "../../textlocal.app.mjs";

export default {
  key: "textlocal-send-sms",
  name: "Send SMS",
  description:
    `This Action can be used to send text messages to either individual numbers or entire contact groups. [See the docs here](https://api.txtlocal.com/docs/sendsms)
    Note: While both numbers and group_id are optional parameters, one or the other must be included in the request for the message to be sent.`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    textlocal,
    sender: {
      propDefinition: [
        textlocal,
        "sender",
      ],
    },
    message: {
      propDefinition: [
        textlocal,
        "message",
      ],
    },
    numbers: {
      propDefinition: [
        textlocal,
        "numbers",
      ],
      description: "Note: While both numbers and group_id are optional parameters, one or the other must be included in the request for the message to be sent.",
      optional: true,
    },
    groupId: {
      propDefinition: [
        textlocal,
        "groupId",
      ],
      description: "Note: While both numbers and group_id are optional parameters, one or the other must be included in the request for the message to be sent.",
      optional: true,
    },
    simpleReply: {
      propDefinition: [
        textlocal,
        "simpleReply",
      ],
      optional: true,
    },
    scheduleTime: {
      propDefinition: [
        textlocal,
        "scheduleTime",
      ],
      optional: true,
    },
    receiptUrl: {
      propDefinition: [
        textlocal,
        "receiptUrl",
      ],
      optional: true,
    },
    custom: {
      propDefinition: [
        textlocal,
        "custom",
      ],
      optional: true,
    },
    optouts: {
      propDefinition: [
        textlocal,
        "optouts",
      ],
      optional: true,
    },
    validity: {
      propDefinition: [
        textlocal,
        "validity",
      ],
      optional: true,
    },
    unicode: {
      propDefinition: [
        textlocal,
        "unicode",
      ],
      optional: true,
    },
    trackingLinks: {
      propDefinition: [
        textlocal,
        "trackingLinks",
      ],
      optional: true,
    },
    test: {
      propDefinition: [
        textlocal,
        "test",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      numbers: this.numbers,
      sender: this.sender,
      message: this.message,
      groupId: this.groupId,
      simple_reply: this.simpleReply,
      schedule_time: this.scheduleTime,
      receipt_url: this.receiptUrl,
      custom: this.custom,
      optouts: this.optouts,
      validity: this.validity,
      unicode: this.unicode,
      tracking_links: this.trackingLinks,
      test: this.test,
    };
    const response = await this.textlocal.sendSMS({
      $,
      params,
    });
    $.export("$summary", "Successfully sent SMS");
    return response;
  },
};
