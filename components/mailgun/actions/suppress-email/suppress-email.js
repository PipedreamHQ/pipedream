const mailgun = require("../../mailgun.app.js");
const {
  props,
  methods,
} = require("../common");

module.exports = {
  key: "mailgun-suppress-email",
  name: "Suppress Email",
  description: "Add email to the Mailgun suppression list.",
  version: "0.0.2",
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
      label: "Category",
      description: "Which suppression list to add the email to",
      options: [
        "bounces",
        "unsubscribes",
        "complaints",
      ],
    },
    bounceErrorCode: {
      type: "string",
      label: "Bounce Error Code",
      description: "Email bounce error code",
      default: "550",
      optional: true,
    },
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    bounceErrorMessage: {
      type: "string",
      label: "Bounce Error Message",
      description: "Email bounce error message",
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    unsubscribeFrom: {
      type: "string",
      label: "Tag to unsubscribe from",
      description: "Use * to unsubscribe an address from all domain’s correspondence",
      default: "*",
      optional: true,
    },
    ...props,
  },
  methods: {
    ...methods,
  },
  async run() {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("address", this.email);
    switch (this.category) {
    case "bounces":
      urlSearchParams.append("code", this.bounceErrorCode);
      urlSearchParams.append("error", this.bounceErrorMessage);
      break;
    case "unsubscribes":
      urlSearchParams.append("tag", this.unsubscribeFrom);
      break;
    }
    const params = urlSearchParams.toString();
    const url = `v3/${this.domain}/${this.category}?${params}`;
    const supressEmail = async function (mailgun, url) {
      return await mailgun.api("request").post(url);
    };
    return await this.withErrorHandler(supressEmail, url);
  },
};
