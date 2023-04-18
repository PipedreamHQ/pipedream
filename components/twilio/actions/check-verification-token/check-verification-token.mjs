import app from "../../twilio.app.mjs";

export default {
  key: "twilio-check-verification-token",
  name: "Check Verification Token",
  description: "Check if user-provided token is correct. [See the documentation](https://www.twilio.com/docs/verify/api) for more information",
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
    code: {
      type: "string",
      label: "Code",
      description: "The code to check",
    },
  },
  async run({ $ }) {
    const res = await this.app.checkVerificationToken(
      this.serviceSid,
      this.to,
      this.code,
    );
    $.export("$summary", `Successfully fetched SMS verification of "${this.to}"`);
    return res;
  },
};
