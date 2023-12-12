import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amplitude",
  propDefinitions: {},
  methods: {
    _baseURL(type) {
      if (type === "httpV2") {
        if (this.$auth.region.startsWith("https://analytics.eu")) {
          return "https://api.eu.amplitude.com/2";
        }
        return "https://api2.amplitude.com/2";
      }
      return `https://${this.$auth.region}`;
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      const config = {
        url: opts.url || `${this._baseURL()}/${path}`,
        data,
        ...opts,
      };
      return axios($, config);
    },
    sendEventData({
      $,
      data,
    }) {
      data.api_key = this.$auth.api_key;
      return this._makeRequest({
        $,
        method: "POST",
        url: `${this._baseURL("httpV2")}/httpapi`,
        data,
      });
    },
  },
};
