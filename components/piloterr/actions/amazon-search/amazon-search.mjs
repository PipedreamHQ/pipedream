import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-amazon-search",
  name: "Amazon Search",
  description: "Search an Amazon store and return products with their ASIN, title, price, rating and review count. [See the documentation](https://docs.piloterr.com/v2/api-reference/amazon/search)",
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
      description: "Keyword or phrase to search for, e.g. `playstation 5`.",
    },
    marketplace: {
      type: "string",
      label: "Marketplace",
      description: "Amazon domain extension of the store to search, e.g. `fr` for amazon.fr. Defaults to `com`.",
      optional: true,
    },
    page: {
      propDefinition: [
        piloterr,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.searchAmazon({
      $,
      params: {
        query: this.query,
        domain: this.marketplace,
        page: this.page,
      },
    });
    $.export("$summary", `Found ${response.length ?? 0} Amazon products for "${this.query}"`);
    return response;
  },
};
