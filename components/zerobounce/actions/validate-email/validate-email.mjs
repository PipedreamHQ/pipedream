import zerobounce from "../../zerobounce.app.mjs";

export default {
  key: "zerobounce-validate-email",
  name: "Validate Email",
  description: "Validates a specific email. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zerobounce,
    email: zerobounce.propDefinitions.email,
  },
  async run({ $ }) {
    const response = await this.zerobounce.validateEmail(this.email);
    $.export("$summary", `Successfully validated email: ${this.email}`);
    return response;
  },
};
