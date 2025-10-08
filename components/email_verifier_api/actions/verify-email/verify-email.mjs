import emailVerifierApi from "../../email_verifier_api.app.mjs";

export default {
  key: "email_verifier_api-verify-email",
  name: "Verify Email",
  description: "Verify an email address with Email Verifier API. [See the documentation](https://www.emailverifierapi.com/app/v2-api-documentation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    emailVerifierApi,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify",
    },
  },
  async run({ $ }) {
    const response = await this.emailVerifierApi.verifyEmail({
      $,
      email: this.email,
    });
    $.export("$summary", `Successfully retrieved verification data for email address \`${this.email}\``);
    return response;
  },
};
