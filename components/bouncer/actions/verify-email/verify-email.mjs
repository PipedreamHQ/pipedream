import app from "../../bouncer.app.mjs";

export default {
  name: "Verify Email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "bouncer-verify-email",
  description: "Verify an email. [See the documentation](https://docs.usebouncer.com/#d253aed7-e0aa-4d09-82c2-0352cc109477)",
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
