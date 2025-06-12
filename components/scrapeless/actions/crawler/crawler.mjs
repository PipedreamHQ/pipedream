import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "crawler-api",
  name: "Crawler",
  description: "Crawl any website at scale and say goodbye to blocks.",
  version: "0.0.1",
  type: "action",
  props: {
    scrapeless,
    apiServer: {
      type: "string",
      label: "Please select a API server",
      default: 'crawl',
      options: [
        {
          label: "Crawl",
          value: 'crawl'
        },
        {
          label: "Scrape",
          value: 'scrape'
        }
      ],
      reloadProps: true,
    },
  },
  async run({ $ }) {
    const { apiServer, ...rest } = this;

    if (apiServer === 'crawl') {
      const submitData = {
        limit: rest.limitCrawlPages,
        url: rest.url,
      }
      const response = await this.scrapeless.crawlerCrawl({
        $,
        submitData,
        ...rest,
      });

      $.export("$summary", `Successfully retrieved crawling results for ${rest.url}`);
      return response;
    }

    if (apiServer === 'scrape') {
      const submitData = {
        url: rest.url,
      }
      const response = await this.scrapeless.crawlerScrape({
        $,
        submitData,
        ...rest,
      });

      $.export("$summary", `Successfully retrieved scraping results for ${rest.url}`);
      return response;
    }
  },
  async additionalProps() {
    const { apiServer } = this;

    const props = {};

    if (apiServer === 'crawl' || apiServer === 'scrape') {
      props.url = {
        type: "string",
        label: "URL to Crawl",
        description: "If you want to crawl in batches, please refer to the SDK of the document",
      }
    }

    if (apiServer === 'crawl') {
      props.limitCrawlPages = {
        type: "integer",
        label: "Number Of Subpages",
        default: 5,
        description: "Max number of results to return",
      }
    }

    return props;
  }
}
