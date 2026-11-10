import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-ebay-search",
  name: "eBay Search",
  description: "Search eBay listings by keyword and return their price, condition, buying format, shipping and seller. Use **Get eBay Listing** with a returned `item_id` for the full listing. [See the documentation](https://docs.piloterr.com/v2/api-reference/ebay/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    query: {
      type: "string",
      label: "Query",
      description: "Keyword on ebay.com, or a search URL on a supported eBay site, e.g. `laptop`.",
    },
    page: {
      propDefinition: [
        piloterr,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.searchEbay({
      $,
      params: {
        query: this.query,
        page: this.page,
      },
    });
    $.export("$summary", `Found ${response.results?.length ?? 0} eBay listings for "${this.query}"`);
    return response;
  },
};
