import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-crawler",
  name: "Crawler",
  description: "Crawl any website at scale and say goodbye to blocks. [See the documentation](https://apidocs.scrapeless.com/api-17509010).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapeless,
    apiServer: {
      type: "string",
      label: "Please select a API server",
      description: "Please select a API server to use",
      default: "crawl",
      options: [
        {
          label: "Crawl",
          value: "crawl",
        },
        {
          label: "Scrape",
          value: "scrape",
        },
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {
      url: {
        type: "string",
        label: "URL to Crawl",
        description: "If you want to crawl in batches, please refer to the SDK of the document",
      },
    };

    if (this.apiServer === "crawl") {
      return {
        ...props,
        limitCrawlPages: {
          type: "integer",
          label: "Number Of Subpages",
          default: 5,
          description: "Max number of results to return",
        },
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      scrapeless,
      apiServer,
      ...inputProps
    } = this;

    const browserOptions = {
      "proxy_country": "ANY",
      "session_name": "Crawl",
      "session_recording": true,
      "session_ttl": 900,
    };

    let response;

    const client = await scrapeless._scrapelessClient();

    if (apiServer === "crawl") {
      response =
        await client.scrapingCrawl.crawl.crawlUrl(inputProps.url, {
          limit: inputProps.limitCrawlPages,
          browserOptions,
        });
    }

    if (apiServer === "scrape") {
      response =
        await client.scrapingCrawl.scrape.scrapeUrl(inputProps.url, {
          browserOptions,
        });
    }

    if (response?.status === "completed" && response?.data) {
      $.export("$summary", `Successfully retrieved crawling results for \`${inputProps.url}\``);
      return response.data;
    } else {
      throw new Error(response?.error || "Failed to retrieve crawling results");
    }
  },
};
