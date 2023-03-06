import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-add-products-to-custom-collections",
  name: "Add Products to Custom Collections",
  description: "Adds a product or products to a custom collection or collections. [See the docs](https://shopify.dev/docs/api/admin-rest/2023-01/resources/collect#post-collects)",
  version: "0.0.1",
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
  async run({ $ }) {
    const results = [];

    for (const productId of this.productIds) {
      for (const collectionId of this.collectionIds) {
        const data = {
          product_id: productId,
          collection_id: collectionId,
        };
        const { result } = await this.shopify.createCollect(data);
        results.push(result);
      }
    }

    $.export("$summary", `Added ${this.productIds.length} product(s) to ${this.collectionIds.length} collection(s).`);
    return results;
  },
};
