import app from "../../getemails.app.mjs";

export default {
  name: "Verify Email",
  description: "The Api verifies your requested email address, whether it is a Good or Bad email address. [See the documentation](https://app2.getemail.io/dash/integration/api/v2/3).",
  key: "getemails-verify-email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Attach an valid email address that you want to verify.",
    },
  },
  async run({ $ }) {
    const res = await this.app.verifyEmail(this.email, $);
    $.export("summary", `Successfully verified the email ${this.email}`);
    return res;
  },
};
