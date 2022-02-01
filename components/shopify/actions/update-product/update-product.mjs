import shopify from "../../shopify.app.mjs";

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
    let product = this.shopify._parseJSONStringObjects(this.product);
    let response = await this.shopify.updateProduct(this.productId, product);
    $.export("$summary", `Updated product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
