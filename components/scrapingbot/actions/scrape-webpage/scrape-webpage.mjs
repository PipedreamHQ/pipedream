import scrapingbot from "../../scrapingbot.app.mjs";

export default {
  key: "scrapingbot-scrape-webpage",
  name: "Scrape Webpage",
  description: "Use ScrapingBot API to extract specific data from a webpage. [See the documentation](https://www.scraping-bot.io/web-scraping-documentation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapingbot,
    url: {
      propDefinition: [
        scrapingbot,
        "url",
      ],
    },
    type: {
      propDefinition: [
        scrapingbot,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.scrapingbot.scrapeWebsite({
      type: this.type,
      data: {
        url: this.url,
        options: {
          premiumProxy: true,
        },
      },
      $,
    });
    if (response) {
      $.export("$summary", "Successfully scraped website.");
    }
    return response;
  },
};
