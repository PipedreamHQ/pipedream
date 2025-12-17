import unleashedSoftware from "../../unleashed_software.app.mjs";

export default {
  key: "unleashed_software-get-stock-on-hand",
  name: "Get Stock On Hand",
  description: "Get the stock on hand for a product. [See the documentation](https://apidocs.unleashedsoftware.com/StockOnHand)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unleashedSoftware,
    productId: {
      propDefinition: [
        unleashedSoftware,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.unleashedSoftware.getStockOnHand({
      $,
      params: {
        productId: this.productId,
      },
    });

    $.export("$summary", `Successfully retrieved stock on hand for product ${this.productId}`);
    return response;
  },
};
