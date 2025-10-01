import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-verify-email",
  name: "Verify Email",
  description: "Verifies the deliverability of a specified email. [See the documentation](https://app.findymail.com/docs/#verifier-POSTapi-verify)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    findymail,
    email: {
      propDefinition: [
        findymail,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.findymail.verifyEmail({
      $,
      data: {
        email: this.email,
      },
    });

    $.export("$summary", `Email verification status: ${response.verified
      ? "Verified"
      : "Not Verified"}`);
    return response;
  },
};
