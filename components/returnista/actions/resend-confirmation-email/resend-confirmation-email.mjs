import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-resend-confirmation-email",
  name: "Resend Confirmation Email",
  description: "Resends the return confirmation email to the consumer for an existing return order."
    + " Use this when a consumer did not receive their original confirmation, when an email bounced, or to re-trigger a notification after a return order is updated."
    + " To look up a return order ID, use **Get Return Orders** or **Get Return Order** first."
    + " To view the email history before resending, use **Get Return Order Emails**."
    + " Requires both an Account ID (from your Returnista dashboard settings) and a Return Order ID."
    + " Note: this triggers an immediate send — there is no scheduling or preview step."
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
