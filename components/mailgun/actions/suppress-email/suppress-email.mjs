import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-suppress-email",
  name: "Suppress Email",
  description: "Add email to the Mailgun suppression list. [See the docs here](https://documentation.mailgun.com/en/latest/api-suppressions.html#suppressions)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "emailString",
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
    ...common.props,
  },
  async run({ $ }) {
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
    const resp = await this.withErrorHandler(this.mailgun.mailgunPostRequest, url);
    $.export("$summary", "Successfully suppressed email");
    return resp;
  },
};
