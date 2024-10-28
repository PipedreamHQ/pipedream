import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hystruct",
  propDefinitions: {
    outputUrl: {
      type: "string",
      label: "Output URL",
      description: "URL for notification when new data entry is scraped",
    },
    dataset: {
      type: "string",
      label: "Dataset",
      description: "Specific dataset to monitor (optional)",
      optional: true,
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow to monitor",
      async options() {
        const workflows = await this.getAllWorkflowData();
        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "The events to subscribe to",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hystruct.com";
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
          "x-api-key": this.$auth.x_api_key,
        },
      });
    },
    async subscribeNewWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/integrations/webhooks/subscribe",
        ...opts,
      });
    },
    async getAllWorkflowData() {
      return this._makeRequest({
        path: "/v1/workflows",
      });
    },
    async listAllWebhooks() {
      return this._makeRequest({
        path: "/v1/integrations/webhooks/list",
      });
    },
    async createNewJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/workflows/${opts.workflowId}/queue`,
        ...opts,
      });
    },
    async unsubscribeWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/integrations/webhooks/unsubscribe/${opts.webhookId}`,
        ...opts,
      });
    },
    async emitNewEvent(data) {
      return this.$emit(data, {
        summary: "New data entry scraped",
        id: data.id,
        ts: Date.now(),
      });
    },
  },
};
