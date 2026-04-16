import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cyfe",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.cyfe.com/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    pushValue({
      widgetId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/push/${widgetId}`,
        ...opts,
      });
    },
  },
};
