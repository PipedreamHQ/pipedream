const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-suppress-email",
  name: "Mailgun Suppress Email",
  description: "Add email to the Mailgun suppression list.",
  version: "0.0.1",
  type: "action",
  props: {
    mailgun,
    domain: {
      propDefinition: [
        mailgun,
        "domain",
      ],
    },
    email: {
      propDefinition: [
        mailgun,
        "email",
      ],
    },
    category: {
      type: "string",
      options: [
        "bounces",
        "unsubscribes",
        "complaints",
      ],
    },
    bounceErrorCode: {
      type: "string",
      label: "Bounce Error Code",
      default: "550",
      optional: true,
    },
    bounceErrorMessage: {
      type: "string",
      label: "Bounce Error Message",
      optional: true,
    },
    unsubscribeFrom: {
      type: "string",
      label: "Tag to unsubscribe from",
      description: "Use * to unsubscribe an address from all domain’s correspondence",
      default: "*",
      optional: true,
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
      const suppression = {
        address: this.email,
      };

      switch (this.category) {
      case "bounces":
        suppression.code = this.bounceErrorCode;
        suppression.error = this.bounceErrorMessage;
        break;

      case "unsubscribes":
        suppression.tag = this.unsubscribeFrom;
        break;
      }

      return await this.mailgun.suppress(this.domain, this.category, suppression);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      if (err.response) {
        return err.response.data;
      }
      return err;
    }
  },
};
