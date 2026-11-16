import app from "../../kwtsms.app.mjs";

export default {
  key: "kwtsms-send-sms",
  name: "Send SMS",
  description: "Sends an SMS to a specified number. [See the documentation](https://www.kwtsms.com/api-documentation.html)",
  version: "0.0.4",
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
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "If set to `true`, the message is queued but never delivered. Its credits are deducted and returned when you delete it from the Sending Queue.",
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
      message,
      test,
    } = this;

    const response = await sendSms({
      $,
      data: {
        sender,
        mobile,
        message,
        test: String(booleanToNumber(test)),
      },
    });

    $.export("$summary", `Successfully sent SMS with ID \`${response["msg-id"]}\``);
    return response;
  },
};
