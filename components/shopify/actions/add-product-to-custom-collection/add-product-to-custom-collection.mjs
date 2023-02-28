import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-add-product-to-custom-collection",
  name: "Add Product to Custom Collection",
  description: "Adds a product to a custom collection. [See the docs](https://shopify.dev/docs/api/admin-rest/2023-01/resources/collect#post-collects)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    productId: {
      propDefinition: [
        shopify,
        "productId",
      ],
    },
    collectionId: {
      propDefinition: [
        shopify,
        "collectionId",
      ],
      description: "ID of the collection that the product will be added to",
      optional: false,
    },
  },
  async run({ $ }) {
    const data = {
      product_id: this.productId,
      collection_id: this.collectionId,
    };

    const { result } = await this.shopify.createCollect(data);
    $.export("$summary", `Added product with ID \`${result.product_id}\` to collection with ID \`${result.collection_id}\``);
    return result;
  },
};
