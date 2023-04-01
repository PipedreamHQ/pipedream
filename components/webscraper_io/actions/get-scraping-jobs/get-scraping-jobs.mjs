import webscraper from "../../webscraper_io.app.mjs";

export default {
  key: "webscraper_io-get-scraping-jobs",
  name: "Get Scraping Jobs",
  description: "Retrieves a list of scraping jobs for a sitemap. [See the docs here](https://webscraper.io/documentation/web-scraper-cloud/api)",
  version: "0.0.1",
  type: "action",
  props: {
    webscraper,
    sitemapId: {
      propDefinition: [
        webscraper,
        "sitemapId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of jobs to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    let page = 1;
    const jobs = [];

    while (true) {
      const {
        data, current_page: currentPage, last_page: lastPage,
      } = await this.webscraper.getScrapingJobs({
        params: {
          sitemap_id: this.sitemapId,
          page,
        },
        $,
      });
      jobs.push(...data);
      if (currentPage === lastPage || jobs.length >= this.maxResults) {
        break;
      }
      page++;
    }
    if (jobs.length > this.maxResults) {
      jobs.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${jobs.length} scraping job${jobs.length === 1
      ? ""
      : "s"}`);

    return jobs;
  },
};
