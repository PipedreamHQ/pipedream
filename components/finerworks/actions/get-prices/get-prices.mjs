import app from "../../finerworks.app.mjs";

export default {
  key: "finerworks-get-prices",
  name: "Get Prices",
  description: "Get the price of a product. [See the documentation](https://v2.api.finerworks.com/Help/Api/POST-v3-get_prices)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    productSku: {
      propDefinition: [
        app,
        "productSku",
      ],
    },
    productQty: {
      propDefinition: [
        app,
        "productQty",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getPrices({
      $,
      data: {
        products: [
          {
            product_qty: this.productQty,
            product_sku: this.productSku,
          },
        ],
      },
    });
    $.export("$summary", `Successfully retrieved ${response.prices.length} ${response.prices.length > 1
      ? "prices"
      : "price"} for product SKU ${this.productSku}`);
    return response;
  },
};
