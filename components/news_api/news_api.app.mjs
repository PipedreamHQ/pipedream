import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "news_api",
  propDefinitions: {
    sourceIds: {
      type: "string[]",
      label: "Source IDs",
      description: "An array of source identifiers (maximum 20) for the news sources or blogs you want headlines from",
      optional: true,
      async options() {
        const { sources } = await this.listSources();
        return sources.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    searchin: {
      type: "string[]",
      label: "Search In",
      description: "The fields to restrict your q search to. Default: all fields are searched",
      options: constants.SEARCH_IN_OPTIONS,
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "Keywords or phrases to search for",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The 2-letter ISO-639-1 code of the language you want to get headlines for",
      options: constants.LANGUAGES,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The order to sort the articles in. Default: `publishedAt`",
      options: constants.SORT_OPTIONS,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Must be between 1 and 100.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://newsapi.org/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Api-Key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listSources(opts = {}) {
      return this._makeRequest({
        path: "/top-headlines/sources",
        ...opts,
      });
    },
    searchEverything(opts = {}) {
      return this._makeRequest({
        path: "/everything",
        ...opts,
      });
    },
    searchTopHeadlines(opts = {}) {
      return this._makeRequest({
        path: "/top-headlines",
        ...opts,
      });
    },
  },
};
