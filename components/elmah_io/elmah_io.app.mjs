import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "elmah_io",
  propDefinitions: {
    logId: {
      label: "Log ID",
      description: "The ID of the log. Requires that your api key have the `logs_read` permission.",
      type: "string",
      async options() {
        const logs = await this.getLogs();

        return logs?.map((log) => ({
          label: log.name,
          value: log.id,
        })) || [];
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
      try {
        return await axios($, {
          ...args,
          url: `${this._apiUrl()}${path}`,
          params: {
            ...args?.params,
            api_key: this._apiKey(),
          },
        });
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(error);
          throw new ConfigurationError(`${error.response.data.title} ${error.response.data.detail}`);
        }
        throw error;
      }
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
