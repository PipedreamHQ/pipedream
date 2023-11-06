import emailable from "../../emailable.app.mjs";

export default {
  key: "emailable-verify-email-address",
  name: "Verify Email Address",
  description: "Verifies a single email address using Emailable. [See the documentation](https://emailable.com/docs/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    emailable,
    email: {
      propDefinition: [
        emailable,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.emailable.verifySingleEmail({
      params: {
        email: this.email,
      },
    });
    $.export("$summary", `Email verification status: ${response.state}`);
    return response;
  },
};
