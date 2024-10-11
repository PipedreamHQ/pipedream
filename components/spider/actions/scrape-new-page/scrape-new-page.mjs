import spider from "../../spider.app.mjs";

export default {
  key: "spider-scrape-new-page",
  name: "Scrape New Page",
  description: "Initiates a new page scrape. [See the documentation](https://spider.cloud/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    spider,
    url: {
      propDefinition: [
        spider,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const content = await this.spider.initiateCrawl();
    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return content;
  },
};
