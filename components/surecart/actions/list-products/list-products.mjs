import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-products",
  name: "List Products",
  description: "Return a list of products. [See the documentation](https://developer.surecart.com/api-reference/products/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    adHoc: {
      type: "boolean",
      label: "Ad Hoc",
      description: "Filter for products with prices that allow ad hoc (custom) amounts.",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter products by archived status.",
      optional: true,
    },
    downloadable: {
      type: "boolean",
      label: "Downloadable",
      description: "Filter for products that have associated downloads.",
      optional: true,
    },
    featured: {
      type: "boolean",
      label: "Featured",
      description: "Filter for featured products only.",
      optional: true,
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    productCollectionIds: {
      type: "string[]",
      label: "Product Collection IDs",
      description: "Filter products by collection IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    productGroupIds: {
      type: "string[]",
      label: "Product Group IDs",
      description: "Filter products by group IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter products by name. Example: `Premium`",
      optional: true,
    },
    recurring: {
      type: "boolean",
      label: "Recurring",
      description: "Set to `true` to return only recurring (subscription) products, or `false` for one-time products.",
      optional: true,
    },
    shippingEnabled: {
      type: "boolean",
      label: "Shipping Enabled",
      description: "Filter for products that have shipping enabled.",
      optional: true,
    },
    shippingProfileIds: {
      type: "string[]",
      label: "Shipping Profile IDs",
      description: "Filter products by shipping profile IDs. Example: `[\"b47ca4c2-6cd2-41d5-aefb-4dc459642c56\"]`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter products by status. Example: `[\"published\"]`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort results by the specified field.",
      optional: true,
      options: [
        "cataloged_at",
        "created_at",
        "name",
        "updated_at",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listProducts,
      args: {
        $,
        params: {
          "ad_hoc": this.adHoc,
          "archived": this.archived,
          "downloadable": this.downloadable,
          "featured": this.featured,
          "ids[]": this.ids,
          "product_collection_ids[]": this.productCollectionIds,
          "product_group_ids[]": this.productGroupIds,
          "query": this.query,
          "recurring": this.recurring,
          "shipping_enabled": this.shippingEnabled,
          "shipping_profile_ids[]": this.shippingProfileIds,
          "status[]": this.status,
          "sort": this.sort,
        },
      },
      max: this.maxResults,
    });

    const products = [];
    for await (const product of results) {
      products.push(product);
    }

    $.export("$summary", `Successfully retrieved ${products.length} product(s)`);
    return products;
  },
};
