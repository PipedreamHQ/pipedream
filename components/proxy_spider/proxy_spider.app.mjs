import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "proxy_spider",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of proxies to retrieve, between 1 and 1000",
      optional: true,
    },
    countryCode: {
      type: "string[]",
      label: "Country Code",
      description: "Add this to retrieve only proxies at this location, i.e.: `US`",
      optional: true,
    },
    responseTime: {
      type: "string[]",
      label: "Response Time",
      description: "Add this to retrieve only proxies with a specific response time",
      optional: true,
      options: constants.TIME_OPTIONS,
    },
    protocols: {
      type: "string[]",
      label: "Protocols",
      description: "Add this to retrieve only proxies with a specific protocol",
      optional: true,
      options: constants.PROTOCOLS,
    },
    type: {
      type: "string[]",
      label: "Type",
      description: "Add this to retrieve only proxies with a type",
      optional: true,
      options: constants.TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://proxy-spider.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },

    async listProxies(args = {}) {
      return this._makeRequest({
        path: "/proxies.json",
        ...args,
      });
    },

    async pingServer(args = {}) {
      return this._makeRequest({
        path: "/ping.json",
        ...args,
      });
    },
  },
};
