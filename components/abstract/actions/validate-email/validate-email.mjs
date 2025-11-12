import abstract from "../../abstract.app.mjs";

export default {
  key: "abstract-validate-email",
  name: "Validate Email",
  description: "Check the deliverability of a specified email address. [See the documentation](https://docs.abstractapi.com/email-validation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    abstract,
    emailAddress: {
      propDefinition: [
        abstract,
        "emailAddress",
      ],
    },
    autoCorrect: {
      propDefinition: [
        abstract,
        "autoCorrect",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.abstract.checkEmailDeliverability({
      $,
      params: {
        email: this.emailAddress,
        auto_correct: this.autoCorrect,
      },
    });

    $.export("$summary", `Checked email ${this.emailAddress} (${response.deliverability})`);
    return response;
  },
};
