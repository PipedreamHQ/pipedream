import shopify from "../../shopify.app.mjs";
import metafieldActions from "../common/metafield-actions.mjs";
import common from "./common.mjs";

export default {
  ...common,
  ...metafieldActions,
  key: "shopify-update-product",
  name: "Update Product",
  description: "Update an existing product. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[put]/admin/api/2022-01/products/{product_id}.json)",
  version: "0.1.3",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      optional: true,
    },
    productDescription: {
      propDefinition: [
        shopify,
        "productDescription",
      ],
    },
    vendor: {
      propDefinition: [
        shopify,
        "vendor",
      ],
    },
    productType: {
      propDefinition: [
        shopify,
        "productType",
      ],
    },
    status: {
      propDefinition: [
        shopify,
        "status",
      ],
    },
    images: {
      propDefinition: [
        shopify,
        "images",
      ],
    },
    options: {
      propDefinition: [
        shopify,
        "options",
      ],
    },
    variants: {
      propDefinition: [
        shopify,
        "variants",
      ],
    },
    tags: {
      propDefinition: [
        shopify,
        "tags",
      ],
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    ...common.props,
  },
};
