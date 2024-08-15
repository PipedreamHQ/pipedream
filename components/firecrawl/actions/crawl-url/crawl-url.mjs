import firecrawl from "../../firecrawl.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "firecrawl-crawl-url",
  name: "Crawl URL",
  description: "Crawls a given input URL and returns the contents of sub-pages. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
    },
    crawlerOptions: {
      propDefinition: [
        firecrawl,
        "crawlerOptions",
      ],
      optional: true,
    },
    pageOptions: {
      propDefinition: [
        firecrawl,
        "pageOptions",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.firecrawl.crawl({
      url: this.url,
      crawlerOptions: this.crawlerOptions,
      pageOptions: this.pageOptions,
    });

    $.export("$summary", `Crawl job started with jobId: ${response.jobId}`);
    return response;
  },
};
