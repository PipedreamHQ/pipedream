import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "awork",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.awork.io/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        method: "delete",
      });
    },
    async createProject({ ...args }) {
      return this._makeRequest({
        path: "/projects",
        method: "post",
        ...args,
      });
    },
    async createCompany({ ...args }) {
      return this._makeRequest({
        path: "/companies",
        method: "post",
        ...args,
      });
    },
    async getUsers({ ...args }) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getTasks({ ...args }) {
      return this._makeRequest({
        path: "/me/projecttasks",
        ...args,
      });
    },
    async getTimeEntries({ ...args }) {
      return this._makeRequest({
        path: "//timeentries",
        ...args,
      });
    },
  },
};
