import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "apiverve",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name to lookup. Do not include the protocol, and not subdomains (e.g., myspace.com)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.apiverve.com/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getWeather(opts = {}) {
      return this._makeRequest({
        path: "/weatherforecast",
        ...opts,
      });
    },
    whoisLookup(opts = {}) {
      return this._makeRequest({
        path: "/whoislookup",
        ...opts,
      });
    },
    dnsLookup(opts = {}) {
      return this._makeRequest({
        path: "/dnslookup",
        ...opts,
      });
    },
    numberToWords(opts = {}) {
      return this._makeRequest({
        path: "/numbertowords",
        ...opts,
      });
    },
    moonPhases(opts = {}) {
      return this._makeRequest({
        path: "/moonphases",
        ...opts,
      });
    },
    streetAddressParser(opts = {}) {
      return this._makeRequest({
        path: "/streetaddressparser",
        ...opts,
      });
    },
    ipBlacklistLookup(opts = {}) {
      return this._makeRequest({
        path: "/ipblacklistlookup",
        ...opts,
      });
    },
    routingNumberLookup(opts = {}) {
      return this._makeRequest({
        path: "/routinglookup",
        ...opts,
      });
    },
    getDictionaryDefinition(opts = {}) {
      return this._makeRequest({
        path: "/dictionary",
        ...opts,
      });
    },
    phoneNumberValidator(opts = {}) {
      return this._makeRequest({
        path: "/phonenumbervalidator",
        ...opts,
      });
    },
  },
};
