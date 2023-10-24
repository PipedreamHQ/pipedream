import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airops",
  propDefinitions: {},
  methods: {
    _workspaceApiKey() {
      return this.$auth.workspace_api_key;
    },
    _apiUrl() {
      return "https://app.airops.com/public_api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          Authorization: `Bearer ${this._workspaceApiKey()}`,
        },
      });
    },
    async runWorkflow({
      appId, async = false, ...args
    }) {
      return this._makeRequest({
        path: `/airops_apps/${appId}/${async
          ? "async_execute"
          : "execute"}`,
        method: "post",
        ...args,
      });
    },
  },
};
