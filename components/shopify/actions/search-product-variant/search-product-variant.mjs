import shopify from "../../shopify.app.js";

export default {
  key: "shopify-search-product-variant",
  name: "Search Product Variant",
  description: "Search for product variants",
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
    productVariantId: {
      propDefinition: [
        shopify,
        "productVariantId",
        (c) => c,
      ],
    },
    fields: {
      propDefinition: [
        shopify,
        "responseFields",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      fields: this.fields,
    };

    let response = await this.shopify.getProductVariant(this.productVariantId, params);
    $.export("$summary", `Found product variant \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
