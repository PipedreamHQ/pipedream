import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "simple_analytics",
  propDefinitions: {
    hostname: {
      type: "string",
      label: "Hostname",
      description: "The website to get stats for, without protocol or path, e.g. `example.com`. Use **List Websites** to find the hostnames in the account.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://simpleanalytics.com";
    },
    _headers({ withUserId = false } = {}) {
      const headers = {
        "Api-Key": this.$auth.api_key,
      };
      if (withUserId) {
        headers["User-Id"] = this.$auth.user_id;
      }
      return headers;
    },
    _makeRequest({
      $ = this, path, withUserId, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers({
          withUserId,
        }),
        ...opts,
      });
    },
    listWebsites(opts = {}) {
      return this._makeRequest({
        path: "/api/websites",
        withUserId: true,
        ...opts,
      });
    },
    getStats({
      hostname, ...opts
    }) {
      return this._makeRequest({
        path: `/${encodeURIComponent(hostname)}.json`,
        ...opts,
      });
    },
  },
};
