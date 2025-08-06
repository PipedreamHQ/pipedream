import apify from "../../apify.app.mjs";
import { ACTOR_ID } from "../../common/constants.mjs";
import {
  ACTOR_JOB_STATUSES, ACTOR_JOB_TERMINAL_STATUSES,
} from "@apify/consts";

export default {
  key: "apify-scrape-single-url",
  name: "Scrape Single URL",
  description: "Executes a scraper on a specific website and returns its content as text. This action is perfect for extracting content from a single page.",
  version: "0.0.4",
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
      ],
    },
  },
  async run({ $ }) {
    const startActorResponse = await this.apify.runActorAsynchronously({
      $,
      actorId: ACTOR_ID,
      data: {
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

    const {
      data: {
        id: runId, defaultDatasetId,
      },
    } = startActorResponse;

    let actorRunStatus = null;
    let retries = 0;
    const maxRetries = 30;
    const delay = 1000;

    while ((!actorRunStatus || !ACTOR_JOB_TERMINAL_STATUSES.includes(actorRunStatus))
          && retries < maxRetries
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const runDetails = await this.apify.getActorRun({
        $,
        runId,
      });
      actorRunStatus = runDetails.data.status;
      retries++;
    }

    if (actorRunStatus !== ACTOR_JOB_STATUSES.SUCCEEDED) {
      throw new Error(`Actor run did not succeed. Final status: ${actorRunStatus}`);
    }

    const datasetResponse = await this.apify.listDatasetItems({
      $,
      datasetId: defaultDatasetId,
      params: {
        limit: 1,
        offset: 0,
      },
    });

    console.log(datasetResponse);

    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return datasetResponse[0];
  },
};
