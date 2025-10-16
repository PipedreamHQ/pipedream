import scrapingbot from "../../scrapingbot.app.mjs";

export default {
  key: "scrapingbot-get-social-media-scraping-data",
  name: "Get Social Media Scraping Data",
  description: "Retrieve data from a social media scraping job by responseId. [See the documentation](https://www.scraping-bot.io/web-scraping-documentation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapingbot,
    scraper: {
      propDefinition: [
        scrapingbot,
        "scraper",
      ],
    },
    responseId: {
      type: "string",
      label: "Response ID",
      description: "ResponseId generated when initiating the scraping job",
    },
  },
  async run({ $ }) {
    const response = await this.scrapingbot.getDataScraperResponse({
      params: {
        scraper: this.scraper,
        responseId: this.responseId,
      },
      $,
    });

    if (response.status === "pending") {
      $.export("$summary", "Scraping Job is still pending.");
    } else {
      $.export("$summary", "Successfully scraped social media site.");
    }

    return response;
  },
};
