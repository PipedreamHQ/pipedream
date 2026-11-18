import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-start-crawl",
  name: "Start Crawl",
  description: "Start crawling a website from a URL. The crawl runs in the background; use **Get Crawl Results** with the returned `id` to get the pages. [See the documentation](https://docs.olostep.com/api-reference/crawls/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    olostep,
    startUrl: {
      propDefinition: [
        olostep,
        "url",
      ],
      label: "Start URL",
      description: "The URL to start crawling from, e.g. `https://docs.olostep.com`",
    },
    maxPages: {
      type: "integer",
      label: "Max Pages",
      description: "Maximum number of pages to crawl",
      min: 1,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Maximum link depth from the start URL",
      optional: true,
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
      description: "Include subdomains of the website. Defaults to `false`.",
    },
    searchQuery: {
      propDefinition: [
        olostep,
        "searchQuery",
      ],
      description: "Find and prioritize pages relevant to this query, e.g. `pricing`",
    },
    webhook: {
      propDefinition: [
        olostep,
        "webhook",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.olostep.startCrawl({
      $,
      data: {
        start_url: this.startUrl,
        max_pages: this.maxPages,
        max_depth: this.maxDepth,
        include_urls: this.includeUrls,
        exclude_urls: this.excludeUrls,
        include_subdomain: this.includeSubdomain,
        search_query: this.searchQuery,
        webhook: this.webhook,
      },
    });
    $.export("$summary", `Started crawl ${response?.id} from ${this.startUrl}`);
    return response;
  },
};
