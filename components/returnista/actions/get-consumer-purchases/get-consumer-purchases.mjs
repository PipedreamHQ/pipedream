import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-consumer-purchases",
  name: "Get Consumer Purchases",
  description: "Gets the purchase history for a consumer by their consumer ID."
    + " Useful for support workflows to understand what a consumer has purchased before they initiated a return."
    + " To find a consumer ID, use **Get Return Orders** with `expand: [\"consumer\"]` on a related return order — the consumer object will include the ID."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/consumer/-consumerId/purchases)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
    consumerId: {
      propDefinition: [
        returnista,
        "consumerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getConsumerPurchases({
      $,
      consumerId: this.consumerId,
    });
    const purchases = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Retrieved ${purchases.length} purchase(s) for consumer ${this.consumerId}`);
    return purchases;
  },
};
