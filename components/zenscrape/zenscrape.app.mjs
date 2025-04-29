import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenscrape",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The target site you want to scrape",
    },
    premium: {
      type: "boolean",
      label: "Premium",
      description: "Uses residential proxies, unlocks sites that are hard to scrape. Counts as 20 credits towards your quota.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "If premium=`false` possible locations are 'na' (North America) and 'eu' (Europe). If premium=`true` you can choose a location from Zenscrape's [list of 230+ countries](https://app.zenscrape.com/documentation#proxyLocationList)",
      optional: true,
    },
    keepHeaders: {
      type: "boolean",
      label: "Keep Headers",
      description: "Allow to pass through forward headers (e.g. user agents, cookies)",
      optional: true,
    },
    render: {
      type: "boolean",
      label: "Render",
      description: "Use a headless browser to fetch content that relies on javascript. Counts as 5 credits towards your quota.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.zenscrape.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          apikey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    getContent(opts = {}) {
      return this._makeRequest({
        path: "/get",
        ...opts,
      });
    },
    getStatus(opts = {}) {
      return this._makeRequest({
        path: "/status",
        ...opts,
      });
    },
  },
};
