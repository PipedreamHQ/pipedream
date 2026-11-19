import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-get-crawl-results",
  name: "Get Crawl Results",
  description: "Get the status of a crawl started with **Start Crawl** and its crawled pages, optionally with each page's Markdown content. While `status` is `in_progress`, call it again later; pages already crawled are returned meanwhile. Use the returned `cursor` to get the next pages. [See the documentation](https://docs.olostep.com/api-reference/crawls/pages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    olostep,
    crawlId: {
      type: "string",
      label: "Crawl ID",
      description: "The ID of the crawl, from the `id` field of **Start Crawl**, e.g. `crawl_96363fn88y`",
    },
    includeContent: {
      propDefinition: [
        olostep,
        "includeContent",
      ],
    },
    limit: {
      propDefinition: [
        olostep,
        "limit",
      ],
      default: 10,
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
      description: "The `cursor` field from a previous **Get Crawl Results** response for the same crawl, to get the next pages, e.g. `10`",
    },
  },
  async run({ $ }) {
    const crawl = await this.olostep.getCrawl({
      $,
      crawlId: this.crawlId,
    });
    const response = await this.olostep.listCrawlPages({
      $,
      crawlId: this.crawlId,
      params: {
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    const pages = response?.pages ?? [];
    if (this.includeContent) {
      await this.olostep.addMarkdown($, pages);
    }
    $.export("$summary", `Crawl is ${crawl?.status}: retrieved ${pages.length} page${pages.length === 1
      ? ""
      : "s"}`);
    return {
      ...crawl,
      pages,
      cursor: response?.cursor,
    };
  },
};
