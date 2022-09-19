import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "woxo",
  propDefinitions: {},
  methods: {
    _team() {
      return this.$auth.team;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.woxo.tech";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "team": this._team(),
          "token": this._apiKey(),
        },
        ...args,
      });
    },
    async getVideos({
      projectId, ...args
    } = {}) {
      const response = await this._makeRequest({
        path: `/video/project/${projectId}`,
        ...args,
      });

      return response?.metadata?.data;
    },
  },
};
