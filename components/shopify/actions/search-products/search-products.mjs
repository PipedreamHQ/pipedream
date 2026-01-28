import shopify from "../../shopify.app.mjs";
import { PRODUCT_SORT_KEY } from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shopify-search-products",
  name: "Search for Products",
  description: "Search for products. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/products)",
  version: "0.0.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    title: {
      type: "string",
      label: "Title",
      description: "The name of the product",
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
      label: "Product IDs",
      description: "Select multiple Product IDs or provide Product IDs as a JSON array. For example: `{{ [\"gid://shopify/Product/1\", \"gid://shopify/Product/2\"] }}`",
      optional: true,
    },
    collectionId: {
      propDefinition: [
        shopify,
        "collectionId",
      ],
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "A categorization for the product used for filtering and searching products",
      optional: true,
    },
    vendor: {
      type: "string",
      label: "Vendor",
      description: "The name of the product's vendor",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        shopify,
        "maxResults",
      ],
    },
    sortKey: {
      propDefinition: [
        shopify,
        "sortKey",
      ],
      description: "The key to sort the results by. Keys `RELEVANCE` and `INVENTORY_TOTAL` not for use with `Collection ID`.",
      options: PRODUCT_SORT_KEY,
    },
    reverse: {
      propDefinition: [
        shopify,
        "reverse",
      ],
    },
  },
  async run({ $ }) {
    const queryArray = [];
    if (this.title && this.exactMatch) {
      queryArray.push(`title:"${this.title}"`);
    }
    if (this.productIds?.length) {
      const idArray = this.productIds.map((id) => `id:${utils.getIdFromGid(id)}`);
      queryArray.push(`(${idArray.join(" OR ")})`);
    }
    if (this.collectionId) {
      queryArray.push(`collection_id:${utils.getIdFromGid(this.collectionId)}`);
    }
    if (this.productType) {
      queryArray.push(`product_type:${this.productType}`);
    }
    if (this.vendor) {
      queryArray.push(`vendor:${this.vendor}`);
    }

    const query = queryArray.length
      ? queryArray.join(" AND ")
      : undefined;

    let products = await this.shopify.getPaginated({
      resourceFn: this.shopify.listProducts,
      resourceKeys: [
        "products",
      ],
      variables: {
        query,
        sortKey: this.sortKey,
        reverse: this.reverse,
      },
    });

    if (this.title && !this.exactMatch) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(this.title.toLowerCase()));
    }

    if (products.length > this.maxResults) {
      products.length = this.maxResults;
    }

    $.export("$summary", `Found ${products.length} product${products.length === 1
      ? ""
      : "s"} matching search criteria`);
    return products;
  },
};
