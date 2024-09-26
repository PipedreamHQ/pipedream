import { axios } from "@pipedream/platform";
import countries from "./common/countries.mjs";
import languages from "./common/languages.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "scrapingbot",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "URL of the page you want to scrape",
    },
    search: {
      type: "string",
      label: "Search",
      description: "The term to search for",
    },
    domainCountry: {
      type: "string",
      label: "Domain Country",
      description: "Set this option to simulate the country of origin for the search request",
      options: countries,
      default: "US",
      optional: true,
    },
    resultLang: {
      type: "string",
      label: "Result Language",
      description: "Set this option to have the search results in a specific language",
      options: languages,
      default: "en",
      optional: true,
    },
    scraper: {
      type: "string",
      label: "Scraper",
      description: "the name of the scraper you want to use",
      options: constants.SCRAPERS,
    },
    type: {
      type: "string",
      label: "Scrape Type",
      description: "Type of scraping job",
      options: constants.SCRAPING_JOB_TYPES,
    },
    engine: {
      type: "string",
      label: "Search Engine",
      description: "Search Engine to scrape",
      options: constants.SEARCH_ENGINES,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format to return the results in",
      options: constants.SEARCH_RESULT_FORMATS,
      default: "json",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.scraping-bot.io/scrape";
    },
    _getAuth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) { console.log(args);
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._getAuth(),
        ...args,
      });
    },
    scrapeWebsite({
      type, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${type}`,
        method: "POST",
        ...args,
      });
    },
    scrapeSearchEngine(args = {}) {
      return this._makeRequest({
        path: "/search-engine",
        method: "POST",
        ...args,
      });
    },
    scrapeSocialMedia(args = {}) {
      return this._makeRequest({
        path: "/data-scraper",
        method: "POST",
        ...args,
      });
    },
    getDataScraperResponse(args = {}) {
      return this._makeRequest({
        path: "/data-scraper-response",
        ...args,
      });
    },
  },
};
