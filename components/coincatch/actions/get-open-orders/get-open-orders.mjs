import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-open-orders",
  name: "Get Open Orders",
  description: "Get pending order list on one symbol. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-open-order)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coincatch,
    productType: {
      propDefinition: [
        coincatch,
        "productType",
      ],
    },
    symbol: {
      propDefinition: [
        coincatch,
        "symbol",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getOpenOrders({
      $,
      params: {
        symbol: this.symbol,
      },
    });
    if (response.data?.orderList?.length) {
      $.export("$summary", `Successfully retrieved ${response.data.orderList.length} pending orders for ${this.symbol}`);
    } else {
      $.export("$summary", "No pending orders found");
    }
    return response;
  },
};
