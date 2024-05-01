import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flipando",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of the app to execute",
      async options() {
        const { results } = await this.listApps();
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://flipando-backend.herokuapp.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    executeApp({
      appId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/integrations/applications/${appId}/completion`,
        ...opts,
      });
    },
    getTask({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/integrations/tasks/${taskId}`,
        ...opts,
      });
    },
    getApp({
      appId, ...opts
    }) {
      return this._makeRequest({
        path: `/v2/integrations/applications/${appId}`,
        ...opts,
      });
    },
    listApps(opts = {}) {
      return this._makeRequest({
        path: "/v2/integrations/applications",
        ...opts,
      });
    },
  },
};
