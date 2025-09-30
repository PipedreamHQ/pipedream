import scrapingbot from "../../scrapingbot.app.mjs";

export default {
  key: "scrapingbot-scrape-search-engine",
  name: "Scrape Search Engine",
  description: "Use ScrapingBot API to extract specific data from Google or Bing search results. [See the documentation](https://www.scraping-bot.io/web-scraping-documentation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapingbot,
    engine: {
      propDefinition: [
        scrapingbot,
        "engine",
      ],
    },
    search: {
      propDefinition: [
        scrapingbot,
        "search",
      ],
    },
    format: {
      propDefinition: [
        scrapingbot,
        "format",
      ],
    },
    domainCountry: {
      propDefinition: [
        scrapingbot,
        "domainCountry",
      ],
    },
    resultLang: {
      propDefinition: [
        scrapingbot,
        "resultLang",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.scrapingbot.scrapeSearchEngine({
      data: {
        engine: this.engine,
        searchType: "search",
        search: this.search,
        format: this.format,
        domainCountry: this.domainCountry,
        resultLang: this.resultLang,
      },
      $,
    });
    if (response) {
      $.export("$summary", "Successfully scraped search engine results.");
    }
    return response;
  },
};
