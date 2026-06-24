import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scrape_autopilot",
  propDefinitions: {
    scrapeAutopilot: {
      type: "app",
      app: "scrape_autopilot",
      label: "Scrape Autopilot",
      description: "Connect your Scrape Autopilot account.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.scrappilot.com";
    },
    _authHeaders() {
      return {
        Authorization: this.$auth.api_key,
      };
    },
    async request($, opts) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${opts.path}`,
        headers: {
          ...this._authHeaders(),
          ...(opts.headers || {}),
        },
      });
    },
  },
};
