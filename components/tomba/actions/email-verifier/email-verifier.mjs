import app from "../../tomba.app.mjs";

export default {
  key: "tomba-email-verifier",
  name: "Verify Email",
  description:
    "Verify the deliverability of an email address. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyEmail({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully verified email: ${this.email}`);
    return response;
  },
};
