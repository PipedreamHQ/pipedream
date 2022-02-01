import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-product",
  name: "Search Product",
  description: "Search for products. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[get]/admin/api/2022-01/products/{product_id}.json)",
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
      fields: this.shopify.parseCommaSeparatedStrings(this.fields),
    };

    let response = await this.shopify.getProduct(this.productId, params);
    $.export("$summary", `Found product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
