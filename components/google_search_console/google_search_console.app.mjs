import { axios } from "@pipedream/platform";
import methods from "./common/methods.mjs";

export default {
  type: "app",
  app: "google_search_console",
  propDefinitions: {},
  methods: {
    ...methods,
    _makeRequest({
      $ = this,
      url,
      ...opts
    }) {
      return axios($, {
        url,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    getSitePerformanceData({
      url, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}/searchAnalytics/query`,
        ...opts,
      });
    },
    submitUrlForIndexing(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        ...opts,
      });
    },
  },
};
