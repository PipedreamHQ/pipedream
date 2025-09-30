import addressfinder from "../../addressfinder.app.mjs";

export default {
  key: "addressfinder-verify-email",
  name: "Verify Email",
  description: "Validates the input email. [See the documentation](https://addressfinder.com.au/api/email/verification/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    addressfinder,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to be verified",
    },
    domain: {
      propDefinition: [
        addressfinder,
        "domain",
      ],
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
      email, domain,
    } = this;
    const response = await this.addressfinder.verifyEmailAddress({
      $,
      params: {
        email,
        domain,
        features: this.features?.join?.(),
      },
    });

    $.export("$summary", `Successfully verified email ${email}`);
    return response;
  },
};
