import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-resend-confirmation-email",
  name: "Resend Confirmation Email",
  description: "Resends the confirmation email for a return order."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id/resend-confirmation-email)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
    returnOrderId: {
      propDefinition: [
        returnista,
        "returnOrderId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.resendConfirmationEmail({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
    });
    $.export("$summary", `Successfully resent confirmation email for return order ${this.returnOrderId}`);
    return response;
  },
};
