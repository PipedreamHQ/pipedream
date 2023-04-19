import scrapingbot from "../../scrapingbot.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "scrapingbot-scrape-social-media",
  name: "Scrape Social Media",
  description: "Use ScrapingBot API to extract specific data from a social media site. [See the documentation](https://www.scraping-bot.io/web-scraping-documentation/)",
  version: "0.0.1",
  type: "action",
  props: {
    scrapingbot,
    scraper: {
      propDefinition: [
        scrapingbot,
        "scraper",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the page you want to scrape",
      optional: true,
    },
    account: {
      type: "string",
      label: "Account",
      description: "The account name you want to extract data from",
      optional: true,
    },
    search: {
      propDefinition: [
        scrapingbot,
        "search",
      ],
      optional: true,
    },
    hashtag: {
      type: "string",
      label: "Hashtag",
      description: "The hashtag you wish to extract data from",
      optional: true,
    },
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
  },
  async run({ $ }) {
    const {
      scraper,
      url,
      account,
      search,
      hashtag,
    } = this;

    if (!url && constants.REQUIRES_URL.includes(scraper)) {
      throw new ConfigurationError(`URL is required for scraper ${scraper}`);
    }

    if (!account && constants.REQUIRES_ACCOUNT.includes(scraper)) {
      throw new ConfigurationError(`Account is required for scraper ${scraper}`);
    }

    if (!search && constants.REQUIRES_SEARCH.includes(scraper)) {
      throw new ConfigurationError(`Search is required for scraper ${scraper}`);
    }

    if (!hashtag && constants.REQUIRES_HASHTAG.includes(scraper)) {
      throw new ConfigurationError(`Hashtag is required for scraper ${scraper}`);
    }

    const { responseId } = await this.scrapingbot.scrapeSocialMedia({
      data: {
        scraper,
        url,
        account,
        search,
        hashtag,
      },
      $,
    });

    const params = {
      scraper,
      responseId,
    };
    let response;
    do {
    // checking for response data every 5s or more, there is no need to check more often
    // as scraping data from social media is quite longer than normal scraping, and
    // ScrapingBot limits how often you can do those checks
      await this.sleep(5000);
      response = await this.scrapingbot.getDataScraperResponse({
        params,
        $,
      });
    } while (response == null || response.status === "pending");

    if (response) {
      $.export("$summary", "Successfully scraped social media site.");
    }
    return response;
  },
};
