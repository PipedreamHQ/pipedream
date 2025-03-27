import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-get-crawl-status",
  name: "Get Crawl Data",
  description: "Obtains the status and data from a previous crawl operation. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl-get)",
  version: "0.0.3",
  type: "action",
  props: {
    firecrawl,
    crawlId: {
      propDefinition: [
        firecrawl,
        "crawlId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firecrawl.getCrawlStatus({
      $,
      crawlId: this.crawlId,
    });

    $.export("$summary", `Successfully retrieved status for crawl (ID: ${this.crawlId})`);
    return response;
  },
};
