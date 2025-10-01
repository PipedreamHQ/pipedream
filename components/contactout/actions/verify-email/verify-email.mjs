import app from "../../contactout.app.mjs";

export default {
  key: "contactout-verify-email",
  name: "Verify Email",
  description: "Verify the deliverability of a single email address. [See the documentation](https://api.contactout.com/#single).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address to verify",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.verifyEmail({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully verified email");
    return response;
  },
};
