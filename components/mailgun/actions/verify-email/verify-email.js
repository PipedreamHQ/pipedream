const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-verify-email",
  name: "Mailgun Verify Email",
  description: "Verify email address deliverability with Mailgun.",
  version: "0.0.1",
  type: "action",
  props: {
    mailgun,
    email: {
      propDefinition: [
        mailgun,
        "email",
      ],
    },
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  async run () {
    try {
      return await this.mailgun.api("validate").get(this.email);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
