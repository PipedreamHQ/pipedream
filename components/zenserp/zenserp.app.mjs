import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenserp",
  propDefinitions: {
    q: {
      type: "string",
      label: "Search Query",
      description: "The search query you want to perform",
    },
    searchEngine: {
      type: "string",
      label: "Search Engine",
      description: "The search engine you want to use",
      optional: true,
      async options() {
        return this.listSearchEngines();
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country you want to search in",
      optional: true,
      async options() {
        const countries = await this.listCountries();
        return countries.map((country) => ({
          value: country.code,
          label: country.name,
        }));
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language you want to use for the search",
      optional: true,
      async options() {
        const languages = await this.listLanguages();
        return languages.map((language) => ({
          value: `lang_${language.code}`,
          label: language.name,
        }));
      },
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "The number of results you want to return",
      optional: true,
      max: 100,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "The offset for the search results - if you use num=100 and want the second page, use start=100. start=0 (default) - first page of results",
      optional: true,
    },
    device: {
      type: "string",
      label: "Device",
      description: "The device you want to use for the search",
      optional: true,
      options: [
        "desktop",
        "mobile",
      ],
    },
    timeframe: {
      type: "string",
      label: "Timeframe",
      description: "The timeframe you want to use for the search",
      optional: true,
      options: [
        {
          value: "now 1-H",
          label: "Past hour",
        },
        {
          value: "now 4-H",
          label: "Past 4 hours",
        },
        {
          value: "now 1-d",
          label: "Past day",
        },
        {
          value: "now 7-d",
          label: "Past 7 days",
        },
        {
          value: "today 1-m",
          label: "Past 30 days",
        },
        {
          value: "today 3-m",
          label: "Past 90 days",
        },
        {
          value: "today 12-m",
          label: "Past 12 months",
        },
        {
          value: "today 5-y",
          label: "Past 5 years",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.zenserp.com/api/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          apikey: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listSearchEngines(opts = {}) {
      return this._makeRequest({
        path: "/search_engines",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/gl",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/hl",
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
  },
};
