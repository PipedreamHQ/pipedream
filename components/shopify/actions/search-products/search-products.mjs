import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-products",
  name: "Search for Products",
  description: "Search for products by Title. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[get]/admin/api/2022-01/products.json)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The product title search should be an exact match",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    let products;
    if (this.exactMatch) {
      products = await this.shopify.getProducts(false, false, {
        title: this.title,
      });
    } else {
      products = (await this.shopify.getProducts(false, false))
        .filter((product) => product.title.toLowerCase().includes(this.title.toLowerCase()));
    }
    $.export("$summary", `Found ${products.length} products with title search \`${this.title}\``);
    return products;
  },
};
