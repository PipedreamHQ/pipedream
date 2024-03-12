import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shorten_rest",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to get click data for",
    },
    longUrl: {
      type: "string",
      label: "Long URL",
      description: "The long URL to shorten",
    },
    aliasName: {
      type: "string",
      label: "Alias Name",
      description: "The custom alias for the shortened URL",
      optional: true,
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain to which the alias will belong",
      default: "short.fyi",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.shorten.rest";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, data, params, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async getClickData({ url }) {
      return this._makeRequest({
        path: "/clicks",
        params: {
          url,
        },
      });
    },
    async createAlias({
      longUrl, aliasName, domainName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/aliases",
        data: {
          aliasName: aliasName || "@rnd",
          domainName: domainName || "short.fyi",
          destinations: [
            {
              destination: longUrl,
            },
          ],
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
