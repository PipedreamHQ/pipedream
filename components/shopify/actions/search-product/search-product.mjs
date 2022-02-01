import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-product",
  name: "Search Product",
  description: "Search for products",
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
    fields: {
      propDefinition: [
        shopify,
        "responseFields",
      ],
    },
  },
  async run({ $ }) {
    let params = {
      fields: this.shopify._parseCommaSeparatedStrings(this.fields),
    };

    let response = await this.shopify.getProduct(this.productId, params);
    $.export("$summary", `Found product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
