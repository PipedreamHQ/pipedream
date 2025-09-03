import apify from "../../apify.app.mjs";
import { gotScraping } from "got-scraping";

export default {
  key: "apify-scrape-single-url",
  name: "Scrape Single URL",
  description: "Executes a scraper on a specific website and returns its content as HTML. This action is perfect for extracting content from a single page. [See the documentation](https://docs.apify.com/sdk/js/docs/examples/crawl-single-url)",
  version: "0.1.0",
  type: "action",
  props: {
    apify,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to scrape.",
    },
  },
  async run({ $ }) {
    const { body } = await gotScraping({
      url: this.url,
    });
    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return body;
  },
};
