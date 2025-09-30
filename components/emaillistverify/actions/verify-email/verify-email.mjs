import app from "../../emaillistverify.app.mjs";

export default {
  key: "emaillistverify-verify-email",
  name: "Verify Email",
  description: "Verify an email. [See the documentation](https://emaillistverify.com/docs/#tag/Email-Validation-API/operation/verifyEmail)",
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
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyEmail({
      params: {
        email: this.email,
      },
    });

    $.export("$summary", `Successfully verified the email. Result: '${response}'`);

    return response;
  },
};
