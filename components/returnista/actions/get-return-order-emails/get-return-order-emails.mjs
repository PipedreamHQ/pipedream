import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order-emails",
  name: "Get Return Order Emails",
  description: "Gets all email communications associated with a return order."
    + " Useful for support and audit workflows to see what emails were sent to the consumer during the return process."
    + " To find a return order ID, use **Get Return Orders** first."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id/emails)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.returnista.getReturnOrderEmails({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
    });
    const emails = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${emails.length} email(s) for return order ${this.returnOrderId}`);
    return response;
  },
};
