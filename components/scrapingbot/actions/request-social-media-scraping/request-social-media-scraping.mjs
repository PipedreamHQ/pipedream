import scrapingbot from "../../scrapingbot.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  key: "scrapingbot-request-social-media-scraping",
  name: "Request Social Media Scraping",
  description: "Use ScrapingBot API to initiate scraping data from a social media site. [See the documentation](https://www.scraping-bot.io/web-scraping-documentation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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

    const response = await this.scrapingbot.scrapeSocialMedia({
      data: {
        scraper,
        url,
        account,
        search,
        hashtag,
      },
      $,
    });

    if (response.responseId) {
      $.export("$summary", `Successfully initiated scraping with responseId ${response.responseId}. Scraping Job may take a few minutes to complete.`);
    }
    return response;
  },
};
