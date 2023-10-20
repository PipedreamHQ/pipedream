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
    workflowRunId: {
      type: "string",
      label: "Workflow Run ID",
      description: "The ID of the Workflow Run",
      async options({ workflowId }) {
        const { workflowRuns } = await this.listWorkflowRuns({
          workflowId,
        });
        return workflowRuns.map((workflowRun) => ({
          label: workflowRun.name,
          value: workflowRun.id,
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
    async createWebhook(opts) {
      return this._makeRequest({
        ...opts,
        method: "post",
        path: "/webhooks",
      });
    },
    async deleteWebhook({
      id, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "delete",
        path: `/webhooks/${id}`,
      });
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
    async listWorkflowRuns({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: "/workflow-runs",
        params: {
          ...opts.params,
          workflowId,
        },
      });
    },
    async listTasks({
      paginate = false, workflowRunId, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listTasks,
          dataName: "tasks",
          workflowRunId,
          ...opts,
        });
      }
      return this._makeRequest({
        ...opts,
        path: `/workflow-runs/${workflowRunId}/tasks`,
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
    async paginate({
      fn, dataName, ...opts
    }) {
      const data = [];

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response[dataName]);

        const next = response.links.find((link) => link.name === "next");
        if (!next) {
          break;
        }

        opts.params = {
          _: next.href.split("=")[1],
        };
      }

      return {
        [dataName]: data,
      };
    },
  },
};
