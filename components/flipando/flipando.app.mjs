import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flipando",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of the app to execute",
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to fetch data",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flipando.ai/v2";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async executeApp({
      appId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/applications/${appId}/tasks`,
      });
    },
    async getTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/tasks/${taskId}`,
      });
    },
    async listApps(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/applications",
      });
    },
  },
};
