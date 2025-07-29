import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "brave_search_api",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "Search query string",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code to localize search results",
      optional: true,
      options: constants.COUNTRY_CODES,
    },
    searchLang: {
      type: "string",
      label: "Search Language",
      description: "Language to use for search results",
      optional: true,
      options: constants.LANGUAGE_CODES,
    },
    uiLang: {
      type: "string",
      label: "UI Language",
      description: "Language for the user interface",
      optional: true,
      options: constants.UI_CODES,
    },
    safesearch: {
      type: "string",
      label: "SafeSearch",
      description: "SafeSearch filter level",
      optional: true,
      options: constants.SEARCH_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.search.brave.com/res/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "x-subscription-token": `${this.$auth.api_key}`,
          "accept": "application/json",
          "accept-encoding": "gzip",
          ...headers,
        },
      });
    },

    async webSearch(args = {}) {
      return this._makeRequest({
        path: "/web/search",
        ...args,
      });
    },
  },
};
