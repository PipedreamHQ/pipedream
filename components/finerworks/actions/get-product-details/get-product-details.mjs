import app from "../../finerworks.app.mjs";

export default {
  key: "finerworks-get-product-details",
  name: "Get Product Details",
  description: "Get details of a product. [See the documentation](https://v2.api.finerworks.com/Help/Api/POST-v3-get_product_details)",
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
    const response = await this.app.getProductDetails({
      $,
      data: {
        products: [
          {
            product_sku: this.productSku,
            product_qty: this.productQty,
          },
        ],
      },
    });
    $.export("$summary", "Successfully sent the request to get details of the specified product");
    return response;
  },
};
