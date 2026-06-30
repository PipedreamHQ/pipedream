import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-tiktok-shop-products",
  name: "Search TikTok Shop Products",
  description: "Searches TikTok Shop for product listings matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/tiktok/shop/products/search&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "searchQuery",
      ],
      description: "Free-form product search term, e.g. `phone case`. Plain string, no dropdown.",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-based page number for pagination (integer). Defaults to page 1 when omitted.",
      optional: true,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTiktokShopProducts({
      $,
      query: this.query,
      page: this.page,
    });
    $.export("$summary", `Successfully fetched TikTok Shop products matching "${this.query}"`);
    return response;
  },
};
