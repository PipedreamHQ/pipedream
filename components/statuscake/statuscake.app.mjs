import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "statuscake",
  propDefinitions: {
    uptimeId: {
      label: "Uptime ID",
      description: "The ID of the uptime",
      type: "string",
      async options({ page }) {
        const uptimes = await this.getUptimes({
          params: {
            page: page + 1,
            limit: 100,
          },
        });

        return uptimes.map((uptime) => ({
          label: uptime.name,
          value: uptime.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.statuscake.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async getUptimes({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "/uptime",
        ...args,
      });

      return response.data;
    },
    async getAlerts({
      uptimeId, ...args
    } = {}) {
      const response = await this._makeRequest({
        path: `/uptime/${uptimeId}/alerts`,
        ...args,
      });

      return response.data;
    },
  },
};
