import shopify from "../../shopify.app.js";

export default {
  key: "shopify-create-product-variant",
  name: "Create Product Variant",
  description: "Create a new product variant",
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
    variant: {
      propDefinition: [
        shopify,
        "variant",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.shopify.createProductVariant(this.productId, this.variant);
    $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
