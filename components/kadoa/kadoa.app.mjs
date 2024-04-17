import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kadoa",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to be triggered.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.kadoa.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async triggerWorkflow({ workflowId }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v2/controller/run/${workflowId}`,
      });
    },
    async getWorkflowData({ workflowId }) {
      return this._makeRequest({
        method: "GET",
        path: `/v2/data/${workflowId}`,
      });
    },
    async getWorkflowStatus({ workflowId }) {
      return this._makeRequest({
        method: "GET",
        path: `/v2/controller/status/${workflowId}`,
      });
    },
    async getWorkflowRunsHistory({ workflowId }) {
      return this._makeRequest({
        method: "GET",
        path: `/v2/workflow-runs-history/${workflowId}`,
      });
    },
    async getWorkflowsOverview() {
      return this._makeRequest({
        method: "GET",
        path: "/v2/controller/overview",
      });
    },
  },
  version: "0.0.1",
};
