import abstract from "../../abstract.app.mjs";

export default {
  key: "abstract-validate-email",
  name: "Validate Email",
  description: "Check the deliverability of a specified email address. [See the documentation](https://docs.abstractapi.com/email-validation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    abstract,
    emailAddress: abstract.propDefinitions.emailAddress,
    autoCorrect: abstract.propDefinitions.autoCorrect,
  },
  async run({ $ }) {
    const response = await this.abstract.checkEmailDeliverability({
      emailAddress: this.emailAddress,
      autoCorrect: this.autoCorrect,
    });

    $.export("$summary", `Checked deliverability for ${this.emailAddress}: ${response.deliverability}`);
    return response;
  },
};
