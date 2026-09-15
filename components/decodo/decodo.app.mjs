import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "decodo",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://scraper-api.decodo.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      if (!this.$auth.web_scraping_api_username || !this.$auth.web_scraping_api_password) {
        throw new ConfigurationError("Must provide Web Scraping API Username and Web Scraping API Password");
      }
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: this.$auth.web_scraping_api_username,
          password: this.$auth.web_scraping_api_password,
        },
        ...opts,
      });
    },
    scrapeUrl(opts = {}) {
      return this._makeRequest({
        path: "/scrape",
        method: "POST",
        ...opts,
      });
    },
  },
};
