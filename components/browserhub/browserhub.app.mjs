import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserhub",
  propDefinitions: {
    automationId: {
      type: "string",
      label: "Automation ID",
      description: "The unique identifier of the automation to monitor",
    },
    scraperId: {
      type: "string",
      label: "Scraper ID",
      description: "The unique identifier for the scraper automation designed to run",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.browserhub.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async triggerScraper({ scraperId }) {
      return this._makeRequest({
        method: "POST",
        path: "/runs",
        data: {
          scraper_id: scraperId,
        },
      });
    },
    async getRunStatus({ automationId }) {
      return this._makeRequest({
        path: `/runs/${automationId}`,
      });
    },
    async listRuns({
      scraperId, page,
    }) {
      return this._makeRequest({
        path: "/runs",
        params: {
          scraper_id: scraperId,
          page,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
