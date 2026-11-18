import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-map-website",
  name: "Map Website",
  description: "Return the list of URLs on a website, optionally filtered by path patterns or sorted by relevance to a query. Use it to find which pages to read, then **Scrape URL** or **Start Batch** to get their content. Large sites return a `cursor` for the next page of URLs. [See the documentation](https://docs.olostep.com/api-reference/maps/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    olostep,
    url: {
      propDefinition: [
        olostep,
        "url",
      ],
      description: "The website to map, e.g. `https://docs.olostep.com`",
    },
    searchQuery: {
      propDefinition: [
        olostep,
        "searchQuery",
      ],
    },
    topN: {
      propDefinition: [
        olostep,
        "topN",
      ],
    },
    includeUrls: {
      propDefinition: [
        olostep,
        "includeUrls",
      ],
    },
    excludeUrls: {
      propDefinition: [
        olostep,
        "excludeUrls",
      ],
    },
    includeSubdomain: {
      propDefinition: [
        olostep,
        "includeSubdomain",
      ],
      description: "Whether to include subdomains of the website, e.g. `false` to exclude them. Defaults to `true`.",
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
      description: "The `cursor` field from a previous **Map Website** response for the same website, to get the next page of URLs, e.g. `abc123_xyz456`",
    },
  },
  async run({ $ }) {
    const response = await this.olostep.mapWebsite({
      $,
      data: {
        url: this.url,
        search_query: this.searchQuery,
        top_n: this.topN,
        include_urls: this.includeUrls,
        exclude_urls: this.excludeUrls,
        include_subdomain: this.includeSubdomain,
        cursor: this.cursor,
      },
    });
    const count = response?.urls?.length ?? 0;
    $.export("$summary", `Found ${count} URL${count === 1
      ? ""
      : "s"} on ${this.url}`);
    return response;
  },
};
