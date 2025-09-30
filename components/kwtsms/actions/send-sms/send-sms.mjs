import app from "../../kwtsms.app.mjs";

export default {
  key: "kwtsms-send-sms",
  name: "Send SMS",
  description: "Sends an SMS to a specified number. [See the documentation](https://www.kwtsms.com/doc/KwtSMS.com_API_Documentation_v37.pdf)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sender: {
      propDefinition: [
        app,
        "senderId",
      ],
    },
    mobile: {
      propDefinition: [
        app,
        "mobile",
      ],
    },
    lang: {
      propDefinition: [
        app,
        "lang",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "If set to `true`, the SMS will be sent to handsets, but will be inserted to the queue and can be deleted to recover the credits.",
      optional: true,
    },
  },
  methods: {
    booleanToNumber(value) {
      return typeof(value) === "boolean" && value
        ? 1
        : 0;
    },
    sendSms(args = {}) {
      return this.app.post({
        path: "/send/",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendSms,
      booleanToNumber,
      sender,
      mobile,
      lang,
      message,
      test,
    } = this;

    const response = await sendSms({
      $,
      data: {
        sender,
        mobile,
        lang,
        message,
        test: booleanToNumber(test),
      },
    });

    $.export("$summary", `Successfully sent SMS with ID \`${response["msg-id"]}\``);
    return response;
  },
};
