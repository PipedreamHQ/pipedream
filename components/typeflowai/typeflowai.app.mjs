import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "typeflowai",
  propDefinitions: {
    workflowIds: {
      type: "string[]",
      label: "Workflow IDs",
      description: "List of workflow IDs that will trigger the webhook. If not provided, the webhook will be triggered for all workflows.",
      async options() {
        const { data } = await this.listWorkflows();
        return data?.map(({
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
      return "https://dashboard.typeflowai.com/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    listWorkflows(opts = {}) {
      return this._makeRequest({
        path: "/management/workflows",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
  },
};
