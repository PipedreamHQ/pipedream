import shopify from "../../shopify_developer_app.app.mjs";
import metafieldActions from "../common/metafield-actions.mjs";
import common from "../../../shopify/actions/update-product-variant/common.mjs";

export default {
  ...common,
  ...metafieldActions,
  key: "shopify_developer_app-update-product-variant",
  name: "Update Product Variant",
  description: "Update an existing product variant. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product-variant#[put]/admin/api/2022-01/variants/{variant_id}.json)",
  version: "0.0.4",
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
      description: `${shopify.propDefinitions.productVariantId.description}
        Option displayed here as the title of the product variant`,
    },
    option: {
      propDefinition: [
        shopify,
        "option",
      ],
      optional: true,
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
        (c) => c,
      ],
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    sku: {
      propDefinition: [
        shopify,
        "sku",
      ],
    },
    countryCodeOfOrigin: {
      propDefinition: [
        shopify,
        "country",
      ],
      description: "The country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of where the item came from",
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
