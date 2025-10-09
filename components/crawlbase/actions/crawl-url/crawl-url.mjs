import crawlbase from "../../crawlbase.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "crawlbase-crawl-url",
  name: "Crawl URL",
  description: "Crawl a URL. [See the documentation](https://crawlbase.com/docs/crawling-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    crawlbase,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to crawl",
    },
    scraper: {
      type: "string",
      label: "Scraper",
      description: "The scraper to use",
      options: constants.SCRAPERS,
      optional: true,
    },
    screenshot: {
      type: "boolean",
      label: "Screenshot",
      description: "Set to `true` to take a screenshot of the page. Must use a JavaScript token for authentication.",
      optional: true,
    },
    store: {
      type: "boolean",
      label: "Store",
      description: "Set to `true` to store a copy of the API response in the Crawlbase Cloud Storage",
      optional: true,
    },
    getHeaders: {
      type: "boolean",
      label: "Get Headers",
      description: "Set to `true` to get the headers of the page",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.crawlbase.makeRequest({
      $,
      params: {
        url: this.url,
        scraper: this.scraper,
        screenshot: this.screenshot,
        store: this.store,
        get_headers: this.getHeaders,
        format: "json",
      },
    });

    $.export("$summary", `Successfully crawled URL: ${this.url}`);
    return response;
  },
};
