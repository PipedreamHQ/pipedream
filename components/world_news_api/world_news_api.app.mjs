import { axios } from "@pipedream/platform";
import countryCodes from "./common/country_codes.mjs";
import languages from "./common/country_codes.mjs";
import options from "./common/options.mjs";

export default {
  type: "app",
  app: "world_news_api",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "The text to match in the news content.",
      optional: true,
    },
    sourceCountries: {
      type: "string[]",
      label: "Source Countries",
      description: "List of [ISO 3166 country codes](https://worldnewsapi.com/docs/#Country-Codes) from which the news should originate.",
      optional: true,
      options: countryCodes,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The [ISO 6391](https://worldnewsapi.com/docs/#Language-Codes) language code of the news.",
      optional: true,
      options: languages,
    },
    minSentiment: {
      type: "string",
      label: "Minimum Sentiment",
      description: "The minimum sentiment of the news.",
      optional: true,
    },
    maxSentiment: {
      type: "string",
      label: "Maximum Sentiment",
      description: "The maximum sentiment of the news.",
      optional: true,
    },
    earliestPublishedDate: {
      type: "string",
      label: "Earliest Published Date",
      description: "The news must have been published after this date. `YYYY-MM-DD HH:MM:SS` format",
      optional: true,
    },
    latestPublishedDate: {
      type: "string",
      label: "Latest Published Date",
      description: "The news must have been published before this date. `YYYY-MM-DD HH:MM:SS` format",
      optional: true,
    },
    newsSources: {
      type: "string[]",
      label: "News Sources",
      description: "A list of news sources from which the news should originate.",
      optional: true,
    },
    authors: {
      type: "string[]",
      label: "Authors",
      description: "A list of authors of the news.",
      optional: true,
    },
    entities: {
      type: "string[]",
      label: "Entities",
      description: "Filter news by entities [(see semantic types)](https://worldnewsapi.com/docs/#Semantic-Types).",
      optional: true,
    },
    locationFilter: {
      type: "string",
      label: "Location Filter",
      description: "Filter news by radius around a certain location. Format is `latitude,longitude,radius in kilometers`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort the news by a certain field.",
      optional: true,
      options: options.SORT_BY,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort the news in ascending or descending order.",
      optional: true,
      options: options.SORT_DIRECTION,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of news to skip in range. `(0-1000)`",
      optional: true,
      min: 0,
      max: 1000,
    },
    number: {
      type: "integer",
      label: "Number",
      description: "The number of news to return in range. `(0-100)`",
      optional: true,
      min: 0,
      max: 100,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.worldnewsapi.com";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          "api-key": this._getApiKey(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async searchNews(params, ctx = this) {
      return this._makeHttpRequest({
        path: "/search-news",
        method: "GET",
        params,
      }, ctx);
    },
    async extractNews(params, ctx = this) {
      return this._makeHttpRequest({
        path: "/extract-news",
        method: "GET",
        params,
      }, ctx);
    },
    async getGeoCoordinates(params, ctx = this) {
      return this._makeHttpRequest({
        path: "/geo-coordinates",
        method: "GET",
        params,
      }, ctx);
    },
  },
};
