import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amplitude",
  propDefinitions: {},
  methods: {
    _baseURL() {
      return "https://api2.amplitude.com/2";
    },
    async _makeRequest({
      $ = this, path, data, ...opts
    }) {
      if (data) {
        data.api_key = this.$auth.api_key;
      }
      const config = {
        url: `${this._baseURL()}/${path}`,
        data,
        ...opts,
      };
      return axios($, config);
    },
    sendEventData({
      $,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "httpapi",
        data,
      });
    },
  },
};
