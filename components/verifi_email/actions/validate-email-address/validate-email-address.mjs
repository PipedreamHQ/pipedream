import verifiEmail from "../../verifi_email.app.mjs";

export default {
  key: "verifi_email-validate-email-address",
  name: "Validate Email Address",
  description: "Validate an email address. [See the documentation](https://verifi.email/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    verifiEmail,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate",
    },
  },
  async run({ $ }) {
    const response = await this.verifiEmail.validateEmailAddress({
      $,
      params: {
        email: this.email,
      },
    });
    $.export("$summary", `Successfully validated email address ${this.email}`);
    return response;
  },
};
