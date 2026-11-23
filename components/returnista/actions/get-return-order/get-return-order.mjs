import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-order",
  name: "Get Return Order",
  description: "Gets the full details of a single return order by ID."
    + " Use `expand` to inline related objects (consumer, shipments, returnRequests) in one call instead of making separate requests."
    + " To find a return order ID, use **Get Return Orders** first."
    + " To view the email communications for a return order, use **Get Return Order Emails**."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId/return-order/-id)",
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
    const response = await this.returnista.getReturnOrder({
      $,
      returnOrderId: this.returnOrderId,
    });
    $.export("$summary", `Successfully retrieved return order ${this.returnOrderId}`);
    return response;
  },
};
