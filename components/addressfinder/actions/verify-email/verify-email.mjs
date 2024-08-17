import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-email",
  name: "Verify Email",
  description: "Validates the input email. [See the documentation](https://addressfinder.com.au/api/email/verification/)",
  version: "0.0.1",
  type: "action",
  props: {
    addressfinder,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to be verified",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Used to identify which of your services is calling the API for activity monitoring purposes. [See the documentation](https://addressfinder.com/r/faq/what-is-the-domain-option-used-for/) for more information.",
      optional: true,
    },
    features: {
      type: "string[]",
      label: "Features",
      description: "The methods of verification to be completed. This will impact the query processing time and data returned in the response.",
      optional: true,
      options: [
        {
          label: "Domain - a check to verify that the domain of the email address is configured to receive emails.",
          value: "domain",
        },
        {
          label: "Connection - a check to verify that the email account exists at the provided domain.",
          value: "connection",
        },
        {
          label: "Email provider - a check that determines the underlaying provider of the email service.",
          value: "provider",
        },
      ],
    },
  },
  async run({ $ }) {
    const {
      addressfinder, features, ...params
    } = this;
    const response = await addressfinder.verifyEmailAddress({
      $,
      params: {
        ...params,
        features: features?.join?.(),
      },
    });

    $.export("$summary", `Successfully verified email ${this.email}`);
    return response;
  },
};
