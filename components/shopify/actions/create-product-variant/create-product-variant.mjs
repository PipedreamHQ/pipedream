import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-create-product-variant",
  name: "Create Product Variant",
  description: "Create a new product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[post]/admin/api/2022-01/products/{product_id}/variants.json)",
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
    productVariant: {
      propDefinition: [
        shopify,
        "variant",
      ],
    },
  },
  async run({ $ }) {
    let productVariant = this.shopify.parseJSONStringObjects(this.productVariant);
    let response = await this.shopify.createProductVariant(this.productId, productVariant);
    $.export("$summary", `Created new product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
