import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airplane",
  propDefinitions: {
    runId: {
      type: "string",
      label: "Run",
      description: "Identifier of a run",
      async options({
        page, status,
      }) {
        const params = {
          page,
        };
        let { runs } = await this.listRuns({
          params,
        });
        if (status) {
          runs = runs.filter((run) => run.status === status );
        }
        return runs?.map(({ id }) => id) || [];
      },
    },
    promptId: {
      type: "string",
      label: "Prompt",
      description: "Identifier of a prompt",
      async options({ runID }) {
        const params = {
          runID,
        };
        const { prompts } = await this.listPrompts({
          params,
        });
        return prompts?.map(({
          id: value, description: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airplane.dev/v0";
    },
    _headers() {
      return {
        "X-Airplane-API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getPrompt(args = {}) {
      return this._makeRequest({
        path: "/prompts/get",
        ...args,
      });
    },
    listRuns(args = {}) {
      return this._makeRequest({
        path: "/runs/list",
        ...args,
      });
    },
    listPrompts(args = {}) {
      return this._makeRequest({
        path: "/prompts/list",
        ...args,
      });
    },
    executeTask(args = {}) {
      return this._makeRequest({
        path: "/tasks/execute",
        method: "POST",
        ...args,
      });
    },
    executeRunbook(args = {}) {
      return this._makeRequest({
        path: "/runbooks/execute",
        method: "POST",
        ...args,
      });
    },
    submitPrompt(args = {}) {
      return this._makeRequest({
        path: "/prompts/submit",
        method: "POST",
        ...args,
      });
    },
  },
};
