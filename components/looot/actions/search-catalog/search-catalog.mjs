import looot from "../../looot.app.mjs";

export default {
  key: "looot-search-catalog",
  name: "Search Catalog",
  description: "Find data endpoints (emails, companies, SERP, news) by what you want to do. Free. Use **Get Operation** to read the exact inputs and price of a result. [See the documentation](https://docs.looot.ai)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    looot,
    query: {
      propDefinition: [
        looot,
        "query",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return. Example: `10`.",
      min: 1,
      default: 10,
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Only return endpoints in this category. Example: `email`.",
      optional: true,
    },
    provider: {
      type: "string",
      label: "Provider",
      description: "Only return endpoints from this provider. Example: `hunter`.",
      optional: true,
    },
    prefer: {
      type: "string",
      label: "Prefer",
      description: "How to rank results.",
      options: [
        "balanced",
        "cheapest",
        "fastest",
        "reliable",
      ],
      optional: true,
    },
    maxPriceMicros: {
      type: "integer",
      label: "Max Price (Micros)",
      description: "Only return endpoints that cost at most this many millionths of a dollar. Example: `50000` is $0.05.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.looot.searchCatalog({
      $,
      params: {
        q: this.query,
        limit: this.limit,
        category: this.category,
        provider: this.provider,
        prefer: this.prefer,
        maxPriceMicros: this.maxPriceMicros,
      },
    });
    const count = Array.isArray(response?.results)
      ? response.results.length
      : Array.isArray(response)
        ? response.length
        : 0;
    $.export("$summary", `Found ${count} endpoint${count === 1
      ? ""
      : "s"} for "${this.query}"`);
    return response;
  },
};
