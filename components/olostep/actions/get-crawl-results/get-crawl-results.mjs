import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-get-crawl-results",
  name: "Get Crawl Results",
  description: "Get the status of a crawl and its crawled pages, optionally with each page's Markdown content. [See the documentation](https://docs.olostep.com/api-reference/crawls/pages)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    olostep,
    crawlId: {
      type: "string",
      label: "Crawl ID",
      description: "The `id` returned by the **Start Crawl** action",
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
    },
    cursor: {
      propDefinition: [
        olostep,
        "cursor",
      ],
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
