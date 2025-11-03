import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-resend-confirmation",
  name: "Resend Confirmation",
  description: "Resend a confirmation email for a specific sender signature. [See the documentation](https://postmarkapp.com/developer/api/signatures-api#resend-confirmation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postmark,
    signatureId: {
      propDefinition: [
        postmark,
        "signatureId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.postmark.resendConfirmation({
      $,
      signatureId: this.signatureId.value,
    });

    $.export("$summary", response.Message);
    return response;
  },
};
