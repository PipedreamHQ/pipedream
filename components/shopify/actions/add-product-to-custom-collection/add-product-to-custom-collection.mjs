import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-add-product-to-custom-collection",
  name: "Add Products to Custom Collections",
  description: "Adds a product or products to a custom collection or collections. [See the documentation](https://shopify.dev/docs/api/admin-rest/2023-01/resources/collect#post-collects)",
  version: "0.0.5",
  type: "action",
  props: {
    shopify,
    productIds: {
      propDefinition: [
        shopify,
        "productId",
      ],
      type: "string[]",
      label: "Product IDs",
    },
    collectionIds: {
      propDefinition: [
        shopify,
        "collectionId",
      ],
      type: "string[]",
      label: "Collection IDs",
      description: "IDs of the collections that the product will be added to",
      optional: false,
    },
  },
};
