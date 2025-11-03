import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-get-scrape-result",
  name: "Get Scrape Result",
  description: "Retrieve the result of a completed scraping job. [See the documentation](https://apidocs.scrapeless.com/api-11949853)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapeless,
    scrapeJobId: {
      type: "string",
      label: "Scrape Job ID",
      description: " The ID of the scrape job you want to retrieve results for. This ID is provided when you submit a scrape job.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.scrapeless.getScrapeResult({
        $,
        scrapeJobId: this.scrapeJobId,
      });

      $.export("$summary", `Successfully retrieved scrape results for job ID ${this.scrapeJobId}`);
      return response;
    } catch ({ response }) {
      $.export("$summary", `Successfully retrieved scrape result with error for job ID ${this.scrapeJobId}`);
      return {
        success: false,
        ...response.data,
      };
    }
  },
};
