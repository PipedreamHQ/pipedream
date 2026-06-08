import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order",
  name: "Get Return Order",
  description: "Gets the full details of a single return order by ID."
    + " Use `expand` to inline related objects (consumer, shipments, returnRequests) in one call instead of making separate requests."
    + " To find a return order ID, use **List Return Orders** first."
    + " To view the email communications for a return order, use **Get Return Order Emails**."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id)",
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
      ],
    },
    expand: {
      propDefinition: [
        returnista,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnOrder({
      $,
      accountId: this.accountId,
      returnOrderId: this.returnOrderId,
      params: {
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved return order ${this.returnOrderId}`);
    return response;
  },
};
