import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "process_street",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the Workflow",
      async options() {
        const { workflows } = await this.listWorkflows();
        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.process.st/api/v1.1";
    },
    _auth() {
      return this.$auth.api_key;
    },
    async runWorkflow(opts) {
      return this._makeRequest({
        ...opts,
        path: "/workflow-runs",
        method: "post",
      });
    },
    async listWorkflows(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/workflows",
      });
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          "X-API-KEY": this._auth(),
        },
      });
    },
  },
};
