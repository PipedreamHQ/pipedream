import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-verify-email",
  name: "Verify Email",
  description: "Verify email address deliverability with Mailgun. [See the docs here](https://documentation.mailgun.com/en/latest/api-email-validation.html)",
  version: "0.0.3",
  type: "action",
  props: {
    mailgun,
    email: {
      propDefinition: [
        mailgun,
        "email",
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
    const verifyEmail = async function (mailgun, opts) {
      const result = await mailgun.api("request").get("/v4/address/validate", {
        address: opts.address,
      });
      if (
        opts.acceptableRiskLevels.length > 0
        && !opts.acceptableRiskLevels.includes(result.body.risk)
      ) {
        return $.flow.exit(`${result.body.risk} risk`);
      }
      return result.body;
    };
    return await this.withErrorHandler(verifyEmail, {
      acceptableRiskLevels: this.acceptableRiskLevels,
      address: this.email,
    });
  },
};
