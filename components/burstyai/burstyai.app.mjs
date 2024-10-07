import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "burstyai",
  propDefinitions: {
    workflow: {
      type: "string",
      label: "Workflow",
      description: "The specific workflow to run",
      required: true,
      async options() {
        const workflows = await this.getWorkflows();
        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Optional parameters for the workflow",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.burstyai.com";
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
    async getWorkflows() {
      const res = await this._makeRequest({
        path: "/burstyai/aiflows",
      });
      return res;
    },
    async triggerWorkflow({
      workflow, parameters,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/burstyai/aiflows/${workflow}/async_run`,
        data: parameters,
      });
    },
    async getWorkflowExecutionResult(jobId) {
      return this._makeRequest({
        path: `/burstyai/aiflowjobs/${jobId}/result`,
      });
    },
  },
};
