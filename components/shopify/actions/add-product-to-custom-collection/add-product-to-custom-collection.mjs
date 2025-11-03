import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-add-product-to-custom-collection",
  name: "Add Products to Custom Collection",
  description: "Adds a product or products to a custom collection. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectionAddProductsV2)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    collectionId: {
      propDefinition: [
        shopify,
        "collectionId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.shopify.addProductsToCollection({
      id: this.collectionId,
      productIds: this.productIds,
    });
    if (response.collectionAddProductsV2.userErrors.length > 0) {
      throw new Error(response.collectionAddProductsV2.userErrors[0].message);
    }
    $.export("$summary", `Added product(s) \`${this.productIds}\` to collection \`${this.collectionId}\``);
    return response;
  },
};
