import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dhl_parcel",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api-gw.dhlparcel.nl";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...opts,
      });
    },
    trackAndTrace(opts = {}) {
      return this._makeRequest({
        path: "/track-trace",
        ...opts,
      });
    },
  },
};
