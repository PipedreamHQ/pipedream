const mailgun = require("../../mailgun.app.js");
const {
  props,
  withErrorHandler,
} = require("../common");

module.exports = {
  key: "mailgun-suppress-email",
  name: "Mailgun Suppress Email",
  description: "Add email to the Mailgun suppression list.",
  version: "0.0.3",
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
    ...props,
  },
  run: withErrorHandler(
    async function () {
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

      const url = `/v3/${this.domain}/${this.category}`;
      const data = Array.isArray(suppression)
        ? suppression
        : [
          suppression,
        ];
      return await this.mailgun.api("request").post(url, data);
    },
  ),
};
