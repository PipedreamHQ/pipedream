import apify from "../../apify.app.mjs";
import { WCC_ACTOR_ID } from "../../common/constants.mjs";
import { ACTOR_JOB_STATUSES } from "@apify/consts";

export default {
  key: "apify-scrape-single-url",
  name: "Scrape Single URL",
  description: "Executes a scraper on a specific website and returns its content as HTML. This action is perfect for extracting content from a single page. [See the documentation](https://docs.apify.com/sdk/js/docs/examples/crawl-single-url)",
  version: "0.1.3",
  type: "action",
  props: {
    apify,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to scrape.",
      optional: false,
    },
    crawlerType: {
      type: "string",
      label: "Crawler Type",
      description: "Select the crawling engine:\n- **Headless web browser** - Useful for modern websites with anti-scraping protections and JavaScript rendering. It recognizes common blocking patterns like CAPTCHAs and automatically retries blocked requests through new sessions. However, running web browsers is more expensive as it requires more computing resources and is slower. It is recommended to use at least 8 GB of RAM.\n- **Stealthy web browser** (default) - Another headless web browser with anti-blocking measures enabled. Try this if you encounter bot protection while scraping. For best performance, use with Apify Proxy residential IPs. \n- **Raw HTTP client** - High-performance crawling mode that uses raw HTTP requests to fetch the pages. It is faster and cheaper, but it might not work on all websites.",
      options: [
        {
          label: "Headless browser (stealthy Firefox+Playwright) - Very reliable, best in avoiding blocking, but might be slow",
          value: "playwright:firefox",
        },
        {
          label: "Headless browser (Chrome+Playwright) - Reliable, but might be slow",
          value: "playwright:chrome",
        },
        {
          label: "Raw HTTP client (Cheerio) - Extremely fast, but cannot handle dynamic content",
          value: "cheerio",
        },
        {
          label: "The crawler automatically switches between raw HTTP for static pages and Chrome browser (via Playwright) for dynamic pages, to get the maximum performance wherever possible.",
          value: "playwright:adaptive",
        },
      ],
      default: "playwright:firefox",
    },
  },
  async run({ $ }) {
    const {
      status,
      defaultDatasetId,
      consoleUrl,
    } = await this.apify.runActor({
      actorId: WCC_ACTOR_ID,
      input: {
        crawlerType: this.crawlerType,
        maxCrawlDepth: 0,
        maxCrawlPages: 1,
        maxResults: 1,
        startUrls: [
          {
            url: this.url,
          },
        ],
      },
    });

    if (status !== ACTOR_JOB_STATUSES.SUCCEEDED) {
      throw new Error(`Run has finished with status: ${status}. Inspect it here: ${consoleUrl}.`);
    }

    const { items } = await this.apify.listDatasetItems({
      datasetId: defaultDatasetId,
    });

    $.export("$summary", "Run of Web Content Crawler finished successfully.");
    return items[0];
  },
};
