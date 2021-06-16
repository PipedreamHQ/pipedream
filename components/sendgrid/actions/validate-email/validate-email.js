const sendgrid = require("../../sendgrid.app");

module.exports = {
  key: "sendgrid-validate-email",
  name: "Validate Email",
  description:
    "Validates an email address. This action requires a Sendgrid's Pro or Premier plan.",
  version: "0.0.4",
  type: "action",
  props: {
    sendgrid,
    email: {
      type: "string",
      label: "Email",
      description: "The email that you want to validate.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "An optional indicator of the email address's source. You may include this if you are capturing email addresses from multiple locations.",
      optional: true,
    },
  },
  async run() {
    if (!this.email) {
      throw new Error("Must provide email parameter.");
    }
    return await this.sendgrid.validateEmail({
      email: this.email,
      source: this.source,
    });
  },
};
