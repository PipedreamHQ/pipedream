import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "skyvern",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace scope for workflows",
      async options() {
        const workflows = await this.listWorkflows();
        return workflows.map((workflow) => ({
          label: workflow.title,
          value: workflow.workspace_id,
        }));
      },
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The unique identifier for a workflow",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The name of the task to be created and run",
    },
    taskGoal: {
      type: "string",
      label: "Task Goal",
      description: "The goal of the task to be created and run",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.skyvern.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async listWorkflows(opts = {}) {
      const params = {
        only_workflows: true,
        ...opts,
      };
      return this._makeRequest({
        path: "/workflows",
        params,
      });
    },
    async emitNewWorkflowEvent({
      workspace, ...opts
    }) {
      const path = `/workflows/${workspace}/events`;
      return this._makeRequest({
        path,
        ...opts,
      });
    },
    async getWorkflowRunDetails({
      workflowId, ...opts
    }) {
      const path = `/workflows/runs/${workflowId}`;
      return this._makeRequest({
        path,
        ...opts,
      });
    },
    async triggerWorkflow({
      workflowId, data, proxyLocation, webhookCallbackUrl, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workflows/${workflowId}/run`,
        data: {
          data,
          proxy_location: proxyLocation,
          webhook_callback_url: webhookCallbackUrl,
        },
        ...opts,
      });
    },
    async createAndRunTask({
      taskName, taskGoal, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        data: {
          name: taskName,
          navigation_goal: taskGoal,
          ...opts,
        },
      });
    },
  },
};
