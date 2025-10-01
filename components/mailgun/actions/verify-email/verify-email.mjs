import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-verify-email",
  name: "Verify Email",
  description: "Verify email address deliverability with Mailgun. [See the docs here](https://documentation.mailgun.com/en/latest/api-email-validation.html)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailgun,
    email: {
      propDefinition: [
        mailgun,
        "emailString",
      ],
    },
    acceptableRiskLevels: {
      propDefinition: [
        mailgun,
        "acceptableRiskLevels",
      ],
    },
    ...common.props,
  },
  async run({ $ }) {
    const resp = await this.withErrorHandler(this.mailgun.verifyEmail, {
      acceptableRiskLevels: this.acceptableRiskLevels,
      address: this.email,
    });
    $.export("$summary", `Email ${this.email} verified.`);
    return resp;
  },
};
