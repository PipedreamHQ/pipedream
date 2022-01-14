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
      type: "object",
      label: "Variant",
      description: `An object representing a different version of the product
        More information at [Shopify Product Variant API](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[post]/admin/api/2022-01/products/{product_id}/variants.json)`,
    },
  },
  async run({ $ }) {
    let response = await this.shopify.createProductVariant(this.productId, this.variant);
    $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
