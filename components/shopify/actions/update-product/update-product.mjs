import shopify from "../../shopify.app.js";

export default {
  key: "shopify-update-product",
  name: "Update Product",
  description: "Update an existing product",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    product: {
      type: "object",
      label: "Product",
      description: "Update details for a product",
    },
  },
  async run({ $ }) {
    if (typeof this.product == "string") {
      this.product = JSON.parse(this.product);
    }
    let response = await this.shopify.updateProduct(this.productId, this.product);
    $.export("$summary", `Updated product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
