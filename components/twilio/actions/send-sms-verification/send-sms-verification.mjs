import app from "../../twilio.app.mjs";

export default {
  key: "twilio-send-sms-verification",
  name: "Send SMS Verification",
  description: "Send an SMS verification to a phone number. [See the documentation](https://www.twilio.com/docs/verify/api) for more information",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    serviceSid: {
      propDefinition: [
        app,
        "serviceSid",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.sendSmsVerificationCode(this.serviceSid, this.to);
    $.export("$summary", `Successfully sent an SMS verification to "${this.to}"`);
    return res;
  },
};
