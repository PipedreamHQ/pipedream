import app from "../../clearout.app.mjs";

export default {
  name: "Verify Email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "clearout-verify-email",
  description: "Verify an email. [See the documentation](https://docs.clearout.io/api.html)",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "Email to be verified. E.g. `email@company.com`",
      type: "string",
    },
    business: {
      label: "Is Business Email",
      description: "Is a business email to be verified",
      type: "boolean",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const verifyEmailFn = this.business
      ? this.app.verifyBusinessEmail
      : this.app.verifyEmail;

    const response = await verifyEmailFn({
      $,
      data: {
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully verified ${this.business
        ? "business"
        : ""} email ${this.email}`);
    }

    return response;
  },
};
