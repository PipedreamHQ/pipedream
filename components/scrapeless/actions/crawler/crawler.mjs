import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "crawler-api",
  name: "Crawler",
  description: "Crawl any website at scale and say goodbye to blocks. [See the documentation](https://apidocs.scrapeless.com/api-17509010).",
  version: "0.0.1",
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
  async run({ $ }) {
    const {
      scrapeless, apiServer, ...inputProps
    } = this;

    if (apiServer === "crawl") {
      const submitData = {
        limit: inputProps.limitCrawlPages,
        url: inputProps.url,
      };
      const response = await scrapeless.crawlerCrawl({
        $,
        submitData,
        ...inputProps,
      });

      $.export("$summary", `Successfully retrieved crawling results for ${inputProps.url}`);
      return response;
    }

    if (apiServer === "scrape") {
      const submitData = {
        url: inputProps.url,
      };
      const response = await scrapeless.crawlerScrape({
        $,
        submitData,
        ...inputProps,
      });

      $.export("$summary", `Successfully retrieved scraping results for ${inputProps.url}`);
      return response;
    }
  },
  async additionalProps() {
    const { apiServer } = this;

    const props = {};

    if (apiServer === "crawl" || apiServer === "scrape") {
      props.url = {
        type: "string",
        label: "URL to Crawl",
        description: "If you want to crawl in batches, please refer to the SDK of the document",
      };
    }

    if (apiServer === "crawl") {
      props.limitCrawlPages = {
        type: "integer",
        label: "Number Of Subpages",
        default: 5,
        description: "Max number of results to return",
      };
    }

    return props;
  },
};
