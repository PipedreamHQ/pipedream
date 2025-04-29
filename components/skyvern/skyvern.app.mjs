import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "skyvern",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The unique identifier for a workflow",
      async options({ page }) {
        const workflows = await this.listWorkflows({
          params: {
            page: page + 1,
          },
        });
        return workflows.map(({
          workflow_permanent_id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    webhookCallbackUrl: {
      type: "string",
      label: "Webhook Callback URL",
      description: "URL where system will send callback once it finishes executing the workflow run.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.skyvern.com/api/v1";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listWorkflows({
      params, ...opts
    }) {
      return this._makeRequest({
        path: "/workflows",
        params: {
          ...params,
          only_workflows: true,
        },
        ...opts,
      });
    },
    getWorkflowRunDetails({
      workflowId, ...opts
    }) {
      const path = `/workflows/${workflowId}/runs`;
      return this._makeRequest({
        path,
        ...opts,
      });
    },
    triggerWorkflow({
      workflowId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/workflows/${workflowId}/run`,
        ...opts,
      });
    },
    createAndRunTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
