import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-get-scrape-result",
  name: "Get Scrape Result",
  description: "Retrieve the result of a completed scraping job. [See the documentation](https://apidocs.scrapeless.com/api-11949853)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapeless,
    scrapeJobId: {
      propDefinition: [
        scrapeless,
        "scrapeJobId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.scrapeless.getScrapeResult({
      scrapeJobId: this.scrapeJobId,
    });

    let summary;
    if (result.state === "completed") {
      summary = `Successfully retrieved scrape results for job ID ${this.scrapeJobId}`;
    } else if (result.state === "failed") {
      summary = `Scrape job ${this.scrapeJobId} failed`;
    } else {
      summary = `Scrape job ${this.scrapeJobId} is still in progress`;
    }

    $.export("$summary", summary);
    return result;
  },
};
