import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ipstack",
  propDefinitions: {
    ip: {
      type: "string",
      label: "IP",
      description: "IPv4 or IPv6 address to be looked up",
    },
    hostname: {
      type: "boolean",
      label: "Hostname",
      description: "If set to `true`, hostname lookup will be included in the API response",
      optional: true,
    },
    security: {
      type: "boolean",
      label: "Security",
      description: "If set to `true`, includes security module in the API response",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Output language using 2-letter ISO 639-1 format",
      optional: true,
      options: constants.LANGUAGE_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ipstack.com";
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
          access_key: `${this.$auth.access_key}`,
          ...params,
        },
      });
    },

    async ipLookup({
      ip, ...args
    }) {
      return this._makeRequest({
        path: `/${ip}`,
        ...args,
      });
    },
  },
};
