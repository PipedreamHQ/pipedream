export default {
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
