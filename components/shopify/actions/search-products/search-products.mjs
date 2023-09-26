import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-search-products",
  name: "Search for Products",
  description: "Search for products. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/product#[get]/admin/api/2022-01/products.json)",
  version: "0.0.11",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      optional: true,
    },
    productIds: {
      propDefinition: [
        shopify,
        "productId",
      ],
      type: "string[]",
      optional: true,
    },
    collectionId: {
      propDefinition: [
        shopify,
        "collectionId",
      ],
    },
    productType: {
      propDefinition: [
        shopify,
        "productType",
      ],
    },
    vendor: {
      propDefinition: [
        shopify,
        "vendor",
      ],
    },
    ...common.props,
  },
};
