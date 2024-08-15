import firecrawl from "../../firecrawl.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "firecrawl-scrape-page",
  name: "Scrape Page",
  description: "Scrapes a URL and returns content from that page. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)",
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
    extractorOptions: {
      propDefinition: [
        firecrawl,
        "extractorOptions",
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
    timeout: {
      propDefinition: [
        firecrawl,
        "timeout",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.firecrawl.scrape({
      url: this.url,
      pageOptions: this.pageOptions,
      extractorOptions: this.extractorOptions,
      timeout: this.timeout,
    });

    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
