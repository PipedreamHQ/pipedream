import { axios } from "@pipedream/platform";
import languages from "./common/languages.mjs";

export default {
  type: "app",
  app: "ipgeolocation",
  propDefinitions: {
    lang: {
      type: "string",
      label: "Language",
      description: "Language for the response. Defaults to English. Only available on paid plans",
      optional: true,
      options: languages,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ipgeolocation.io/v3";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest({
      $ = this,
      path,
      method = "GET",
      params = {},
      data,
      headers = {},
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        params: {
          apiKey: this._apiKey(),
          ...params,
        },
        data,
        ...opts,
      });
    },
    convertTimezone(opts = {}) {
      return this._makeRequest({
        path: "/timezone/convert",
        ...opts,
      });
    },
    getAbuseContact(opts = {}) {
      return this._makeRequest({
        path: "/abuse",
        ...opts,
      });
    },
    getAsn(opts = {}) {
      return this._makeRequest({
        path: "/asn",
        ...opts,
      });
    },
    getAstronomy(opts = {}) {
      return this._makeRequest({
        path: "/astronomy",
        ...opts,
      });
    },
    getAstronomyTimeSeries(opts = {}) {
      return this._makeRequest({
        path: "/astronomy/timeSeries",
        ...opts,
      });
    },
    getBulkGeolocation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ipgeo-bulk",
        ...opts,
      });
    },
    getBulkIpSecurity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/security-bulk",
        ...opts,
      });
    },
    getGeolocation(opts = {}) {
      return this._makeRequest({
        path: "/ipgeo",
        ...opts,
      });
    },
    getIpSecurity(opts = {}) {
      return this._makeRequest({
        path: "/security",
        ...opts,
      });
    },
    getTimezone(opts = {}) {
      return this._makeRequest({
        path: "/timezone",
        ...opts,
      });
    },
    parseBulkUserAgent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user-agent-bulk",
        ...opts,
      });
    },
    parseUserAgent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user-agent",
        ...opts,
      });
    },
  },
};
