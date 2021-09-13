const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-verify-email",
  name: "Mailgun Verify Email",
  description: "Verify email address deliverability with Mailgun.",
  version: "0.0.8",
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
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  async run ({ $ }) {
    try {
      const result = await this.mailgun.api("request").get("/v4/address/validate", {
        address: this.email,
      });
      if (
        this.acceptableRiskLevels.length > 0
        && !this.acceptableRiskLevels.includes(result.body.risk)
      ) {
        return $.flow.exit(`${result.body.risk} risk`);
      }
      return result.body;
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
