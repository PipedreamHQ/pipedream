import apify from "../../apify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "apify-scrape-single-url",
  name: "Scrape Single URL",
  description: "Executes a scraper on a specific website and returns its content as text. This action is perfect for extracting content from a single page.",
  version: "0.0.1",
  type: "action",
  props: {
    apify,
    url: apify.propDefinitions.url,
  },
  async run({ $ }) {
    const response = await this.apify.scrapePage({
      url: this.url,
    });
    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
