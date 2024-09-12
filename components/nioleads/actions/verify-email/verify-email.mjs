import nioleads from "../../nioleads.app.mjs";

export default {
  key: "nioleads-verify-email",
  name: "Verify Email",
  description: "Checks the deliverability of a specified email address. [See the documentation](https://apidoc.nioleads.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nioleads,
    email: {
      propDefinition: [
        nioleads,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nioleads.verifyEmail(this.email);
    $.export("$summary", `Verified email ${this.email}`);
    return response;
  },
};
