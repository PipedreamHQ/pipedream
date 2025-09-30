import webscraper from "../../webscraper_io.app.mjs";

export default {
  key: "webscraper_io-create-scraping-job",
  name: "Create Scraping Job",
  description: "Creates a scraping job (scrapes a sitemap). [See the docs here](https://webscraper.io/documentation/web-scraper-cloud/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    driver: {
      type: "string",
      label: "Driver",
      description: "Driver to use for the scraping job",
      options: [
        "fast",
        "fulljs",
      ],
      default: "fast",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscraper.createScrapingJob({
      data: {
        sitemap_id: this.sitemapId,
        driver: this.driver,
        page_load_delay: 2000,
        request_interval: 2000,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created scraping job with ID: ${response.data.id}`);
    }

    return response;
  },
};
