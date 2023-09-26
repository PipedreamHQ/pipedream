import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/search-product-variant/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-search-product-variant",
  name: "Search for Product Variant",
  description: "Search for product variants or create one if not found. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#top)",
  version: "0.0.2",
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
      description: "ID of the product variant. Takes precedence over **Title**",
      optional: true,
    },
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "The name of the product variant",
      optional: true,
    },
    ...common.props,
  },
};
