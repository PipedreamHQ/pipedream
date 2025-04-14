import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adyntel",
  propDefinitions: {
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search by",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Use if you want to limit the search to only one country. E.g. `US`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.adyntel.com";
    },
    _makeRequest({
      $ = this,
      method = "POST",
      path = "/",
      data = {},
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          api_key: this.$auth.api_key,
          email: this.$auth.username,
        },
      });
    },
    metaAdSearch(opts = {}) {
      return this._makeRequest({
        path: "/facebook_ad_search",
        ...opts,
      });
    },
    getGoogleAds(opts = {}) {
      return this._makeRequest({
        path: "/google",
        ...opts,
      });
    },
    getTiktokAds(opts = {}) {
      return this._makeRequest({
        path: "/tiktok_search",
        ...opts,
      });
    },
  },
};
