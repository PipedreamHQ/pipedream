import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    runId: {
      type: "string",
      label: "Run ID",
      description: "The unique identifier for the run.",
      async options({ prevContext }) {
        const runs = await this.listRuns({
          threadId: prevContext.threadId,
        });
        return runs.map((run) => ({
          label: `Run ${run.id} (${run.status})`,
          value: run.id,
        }));
      },
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The unique identifier for the thread.",
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter events by run status.",
      options: [
        "succeeded",
        "failed",
        "canceled",
        "running",
        "pending",
      ],
    },
  },
  methods: {
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest({
      $ = this, method = "GET", path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async listRuns({
      threadId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        params: opts,
      });
    },
    // Add any other methods that are necessary for emitting an event when a run changes its status
  },
};
