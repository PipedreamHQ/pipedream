import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-create-product-variant",
  name: "Create Product Variant",
  description: "Create a new product variant. [See the documentation](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[post]/admin/api/2022-01/products/{product_id}/variants.json)",
  version: "0.0.13",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    option: {
      propDefinition: [
        shopify,
        "option",
      ],
    },
    price: {
      propDefinition: [
        shopify,
        "price",
      ],
      description: "The price of the product variant",
    },
    imageId: {
      propDefinition: [
        shopify,
        "imageId",
        (c) => ({
          productId: c.productId,
        }),
      ],
    },
    sku: {
      propDefinition: [
        shopify,
        "sku",
      ],
    },
    locationId: {
      propDefinition: [
        shopify,
        "locationId",
      ],
      optional: true,
    },
    ...common.props,
  },
};
