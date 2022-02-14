import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-products",
  name: "Search for Products",
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
  },
  async run({ $ }) {
    let response = (await this.shopify.getProduct(this.productId)).result;
    $.export("$summary", `Found product \`${response.title}\` with id \`${response.id}\``);
    return response;
  },
};
