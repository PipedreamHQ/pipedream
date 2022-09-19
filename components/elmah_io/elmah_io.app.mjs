import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "elmah_io",
  propDefinitions: {
    logId: {
      label: "Log ID",
      description: "The ID of the log",
      type: "string",
      async options() {
        const logs = await this.getLogs();

        return logs.map((log) => ({
          label: log.name,
          value: log.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.elmah.io/v3";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        ...args,
        url: `${this._apiUrl()}${path}`,
        params: {
          ...args?.params,
          api_key: this._apiKey(),
        },
      });
    },
    async getLogs(args = {}) {
      return this._makeRequest({
        path: "/logs",
        ...args,
      });
    },
    async getMessages({
      logId, ...args
    } = {}) {
      const response = await this._makeRequest({
        path: `/messages/${logId}`,
        ...args,
      });

      return response.messages;
    },
  },
};
