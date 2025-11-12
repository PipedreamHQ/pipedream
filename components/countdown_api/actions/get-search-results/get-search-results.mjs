import app from "../../countdown_api.app.mjs";

export default {
  key: "countdown_api-get-search-results",
  name: "Get Search Results from eBay",
  description: "Retrieves search results from eBay. [See the documentation](https://www.countdownapi.com/docs/ebay-product-data-api/parameters/search)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchTerm: {
      propDefinition: [
        app,
        "searchTerm",
      ],
    },
    ebayDomain: {
      propDefinition: [
        app,
        "ebayDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getData({
      $,
      params: {
        search_term: this.searchTerm,
        ebay_domain: this.ebayDomain,
        type: "search",
      },
    });

    $.export("$summary", `Successfully retrieved search results for ${this.searchTerm}`);
    return response;
  },
};
