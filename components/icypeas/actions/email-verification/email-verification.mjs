import icypeas from "../../icypeas.app.mjs";

export default {
  key: "icypeas-email-verification",
  name: "Email Verification",
  description: "Performs an email verification check. [See the documentation](https://api-doc.icypeas.com/find-emails/single-search/email-verification)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    icypeas,
    email: {
      propDefinition: [
        icypeas,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.icypeas.verifyEmail({
      $,
      data: {
        email: this.email,
      },
    });
    $.export("$summary", `Email verification status for ${this.email} retrieved successfully!`);
    return response;
  },
};
