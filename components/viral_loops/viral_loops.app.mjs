import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "viral_loops",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://app.viral-loops.com/api/v3";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          apiToken: this._apiToken(),
        },
        ...args,
      });
    },
    async createParticipant({ ...args }) {
      return this._makeRequest({
        path: "/campaign/participant",
        method: "post",
        ...args,
      });
    },
    async getParticipant({ ...args }) {
      return this._makeRequest({
        path: "/campaign/participant/query",
        method: "post",
        ...args,
      });
    },
    async getCampaign({ ...args }) {
      return this._makeRequest({
        path: "/campaign",
        ...args,
      });
    },
  },
};
