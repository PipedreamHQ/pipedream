import spider from "../../spider.app.mjs";

export default {
  key: "spider-scrape-new-page",
  name: "Scrape New Page",
  description: "Initiates a new page scrape (crawl). [See the documentation](https://spider.cloud/docs/api#crawl-website)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    spider,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: "See [the Spider documentation](https://spider.cloud/docs/api#crawl-website) for information on limits and best practices.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URI resource to crawl, e.g. `https://spider.cloud`. This can be a comma split list for multiple urls.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum amount of pages allowed to crawl per website. Default is 0, which crawls all pages.",
      optional: true,
    },
    storeData: {
      type: "boolean",
      label: "Store Data",
      description: "Decide whether to store data. Default is `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const content = await this.spider.initiateCrawl({
      $,
      data: {
        url: this.url,
        limit: this.limit,
        store_data: this.storeData,
      },
    });
    $.export("$summary", `Successfully scraped URL ${this.url}`);
    return content;
  },
};
