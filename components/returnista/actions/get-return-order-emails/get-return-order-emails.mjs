import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order-emails",
  name: "Get Return Order Emails",
  description: "Gets all email communications associated with a return order."
    + " Useful for support and audit workflows to see what emails were sent to the consumer during the return process."
    + " To find a return order ID, use **Get Return Orders** first."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id/emails)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
    returnOrderId: {
      propDefinition: [
        returnista,
        "returnOrderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnOrderEmails({
      $,
      returnOrderId: this.returnOrderId,
    });
    const emails = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${emails.length} email(s) for return order ${this.returnOrderId}`);
    return emails;
  },
};
