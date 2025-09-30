import app from "../../kickbox.app.mjs";

export default {
  name: "Verify Email",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "kickbox-verify-email",
  description: "Verify an email. [See the documentation](https://docs.kickbox.com/docs/single-verification-api)",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "Email to be verified. E.g. `email@company.com`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyEmail({
      $,
      params: {
        email: this.email,
      },
    });

    if (response) {
      $.export("$summary", `Successfully verified email ${this.email}`);
    }

    return response;
  },
};
