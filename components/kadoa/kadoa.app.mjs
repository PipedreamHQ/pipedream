import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kadoa",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to be triggered. The workflow must be approved.",
      async options() {
        const data = await this.getWorkflowsOverview();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.kadoa.com/v2";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscribe",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/unsubscribe/${hookId}`,
      });
    },
    triggerWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/controller/run/${workflowId}`,
        ...opts,
      });
    },
    getWorkflowsOverview() {
      return this._makeRequest({
        method: "GET",
        path: "/controller/overview",
      });
    },
  },
};
