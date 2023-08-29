import app from "../../listclean.app.mjs";

export default {
  name: "Verify Email",
  version: "0.0.1",
  key: "listclean-verify-email",
  description: "Verify an email address. [See the documentation](https://api.listclean.xyz/#tag/verifications)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email to be verified",
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyEmail({
      $,
      email: this.email,
    });

    if (response?.success) {
      $.export("$summary", `Successfully verified email ${this.email}`);
    }

    return response;
  },
};
