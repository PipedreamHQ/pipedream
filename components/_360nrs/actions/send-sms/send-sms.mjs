import app from "../../_360nrs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "_360nrs-send-sms",
  name: "Send SMS",
  description: "Send an SMS message to one or more recipients. [See the documentation](https://apidocs.360nrs.com/?shell#sms)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    to: {
      type: "string[]",
      label: "To Phone Number(s)",
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
  },
  methods: {
    sendSMS(args = {}) {
      return this.app.post({
        path: "/sms",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendSMS,
      message,
      from,
      to,
    } = this;

    const response = await sendSMS({
      data: {
        message,
        to: utils.parseArray(to),
        from,
      },
    });

    $.export("$summary", `Successfully sent SMS with ID \`${response.result[0]?.id}\``);
    return response;
  },
};
