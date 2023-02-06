import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-search-products",
  name: "Search for Products",
  description: "Search for products. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/product#[get]/admin/api/2022-01/products.json)",
  version: "0.0.5",
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
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The product title search should be an exact match",
      optional: true,
      default: false,
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
  },
  async run({ $ }) {
    const {
      title,
      exactMatch,
      productIds,
      collectionId,
      productType,
      vendor,
    } = this;

    const params = {
      ids: productIds?.join(),
      collection_id: collectionId,
      product_type: productType,
      vendor,
    };
    if (title && exactMatch) {
      params.title = title;
    }

    let products = await this.shopify.getProducts(false, false, params);

    if (title && !exactMatch) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(title.toLowerCase()));
    }

    $.export("$summary", `Found ${products.length} product(s) matching search criteria.`);
    return products;
  },
};
