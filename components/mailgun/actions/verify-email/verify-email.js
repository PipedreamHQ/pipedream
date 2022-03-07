const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-verify-email",
  name: "Verify Email",
  description: "Verify email address deliverability with Mailgun.",
  version: "0.0.2",
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
    ...props,
  },
  methods: {
    ...methods,
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
