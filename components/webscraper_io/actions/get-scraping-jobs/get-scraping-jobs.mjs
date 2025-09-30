import webscraper from "../../webscraper_io.app.mjs";

export default {
  key: "webscraper_io-get-scraping-jobs",
  name: "Get Scraping Jobs",
  description: "Retrieves a list of scraping jobs for a sitemap. [See the docs here](https://webscraper.io/documentation/web-scraper-cloud/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const jobs = await this.webscraper.paginate(this.webscraper.getScrapingJobs, {
      sitemap_id: this.sitemapId,
    }, this.maxResults);

    $.export("$summary", `Successfully retrieved ${jobs.length} scraping job${jobs.length === 1
      ? ""
      : "s"}`);

    return jobs;
  },
};
