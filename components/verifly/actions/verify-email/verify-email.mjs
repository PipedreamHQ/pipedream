import app from "../../verifly.app.mjs";

export default {
  key: "verifly-verify-email",
  name: "Verify Email",
  description: "Verify a single email address for deliverability, syntax, MX, SMTP, disposable, role, catch-all and free-provider signals. [See the documentation](https://verifly.email/openapi.json).",
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

    $.export("$summary", `Successfully verified \`${this.email}\` (result: ${response.result ?? "unknown"})`);

    return response;
  },
};
