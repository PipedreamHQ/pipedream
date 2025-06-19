import { axios } from "@pipedream/platform";
import { HttpsProxyAgent } from "https-proxy-agent";

export default {
  type: "app",
  app: "oxylabs",
  propDefinitions: {
    geoLocation: {
      type: "string",
      label: "Geo Location",
      description: "The geo locatio to scrape from. E.g. `United States`",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.api_name}.oxylabs.io/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.password}`,
        },
        ...opts,
      });
    },
    scrape(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/queries",
        ...opts,
      });
    },
    async createSession({
      $ = this, proxyUrl, ...opts
    }) {
      const agent = new HttpsProxyAgent(proxyUrl);
      return axios($, {
        url: "https://ip.oxylabs.io/location",
        httpsAgent: agent,
        ...opts,
      });
    },
    createSchedule(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/schedules",
        ...opts,
      });
    },
  },
};
