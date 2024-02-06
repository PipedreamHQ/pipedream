export default {
  props: {
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The product title search should be an exact match",
      optional: true,
      default: false,
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

    let productIdString = productIds;
    if (Array.isArray(productIds)) {
      productIdString = productIds.join();
    }
    else if (typeof productIds === "string") {
      if (productIds.startsWith("[") && productIds.endsWith("]")) {
        productIdString = productIds.slice(1, -1);
      }
      productIdString = productIdString.replace(/\s/g, "");
    }

    const params = {
      ids: productIdString,
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
