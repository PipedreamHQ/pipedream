import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "retool",
  methods: {
    _baseUrl() {
      return "https://api.retool.com/api/v2";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
        Accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createOrgUserAttribute(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user_attributes",
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...args,
      });
    },
    triggerWorkflow({
      workflowId, apiKey, ...args
    }) {
      return this._makeRequest({
        path: `/workflows/${workflowId}/startTrigger`,
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Api-Key": apiKey,
        },
        ...args,
      });
    },
  },
};
