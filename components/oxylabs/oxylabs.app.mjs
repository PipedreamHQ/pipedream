import { axios } from "@pipedream/platform";
import { HttpsProxyAgent } from "https-proxy-agent";

export default {
  type: "app",
  app: "oxylabs",
  propDefinitions: {
    scheduleId: {
      type: "string",
      label: "Schedule ID",
      description: "The ID of the schedule to watch",
      async options() {
        const { schedules } = await this.listSchedules();
        return schedules || [];
      },
    },
    geoLocation: {
      type: "string",
      label: "Geo Location",
      description: "The geo location to scrape from. [See the guide](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/localization/e-commerce-localization) for using this property.",
      optional: true,
    },
    parse: {
      type: "boolean",
      label: "Parse",
      description: "Set to `true` to receive structured data",
      optional: true,
    },
    render: {
      type: "string",
      label: "Render",
      description: "Set to `html` to get the raw output of the rendered page",
      options: [
        "html",
      ],
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
    listSchedules(opts = {}) {
      return this._makeRequest({
        path: "/schedules",
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
    getRunsInfo({
      scheduleId, ...opts
    }) {
      return this._makeRequest({
        path: `/schedules/${scheduleId}/runs`,
        ...opts,
      });
    },
  },
};
