import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-map-website",
  name: "Map Website",
  description: "Get the list of URLs on a website, optionally filtered by path patterns or sorted by relevance to a query. [See the documentation](https://docs.olostep.com/api-reference/maps/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      description: "Include subdomains of the website. Defaults to `true`.",
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.olostep.map({
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
