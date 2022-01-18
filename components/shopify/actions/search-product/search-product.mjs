import shopify from "../../shopify.app.js";

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
      fields: this.fields,
    };

    let response = await this.shopify.getProduct(this.productId, params);
    let title = response.title
      ? ` \`${response.title}\``
      : "";
    let id = response.id
      ? ` with id \`${response.id}\``
      : "";

    $.export("$summary", `Found product${title}${id}`);
    return response;
  },
};
