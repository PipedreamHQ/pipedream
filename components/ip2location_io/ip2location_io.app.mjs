import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ip2location_io",
  propDefinitions: {
    format: {
      type: "string",
      label: "Format",
      description: "Format of the response message. If unspecified, `json` format will be used for the response message.",
      options: [
        "json",
        "xml",
      ],
      optional: true,
    },
  },
  methods: {
    _params(params = {}) {
      return {
        ...params,
        key: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      params,
      ...args
    }) {
      return axios($, {
        url,
        params: this._params(params),
        ...args,
      });
    },
    lookupIpAddress(args = {}) {
      return this._makeRequest({
        url: "https://api.ip2location.io",
        ...args,
      });
    },
  },
};
