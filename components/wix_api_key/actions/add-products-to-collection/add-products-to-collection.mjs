import wix from "../../wix_api_key.app.mjs";

export default {
  key: "wix_api_key-add-products-to-collection",
  name: "Add Products To Collection",
  description: "Adds a product or products to a specified collection. [See the documentation](https://dev.wix.com/api/rest/wix-stores/catalog/collections/add-products-to-collection)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wix,
    site: {
      propDefinition: [
        wix,
        "site",
      ],
    },
    collection: {
      propDefinition: [
        wix,
        "collection",
        (c) => ({
          siteId: c.site,
        }),
      ],
    },
    products: {
      propDefinition: [
        wix,
        "products",
        (c) => ({
          siteId: c.site,
        }),
      ],
    },
  },
  async run({ $ }) {
    const productIds = Array.isArray(this.products)
      ? this.products
      : JSON.parse(this.products);
    const response = await this.wix.addProductsToCollection({
      siteId: this.site,
      collectionId: this.collection,
      data: {
        productIds,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully added ${productIds.length} product${productIds.length === 1
        ? ""
        : "s"} to collection.`);
    }

    return response;
  },
};
