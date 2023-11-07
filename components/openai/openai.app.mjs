import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    runId: {
      type: "string",
      label: "Run ID",
      description: "The ID of the run to monitor for status changes.",
      optional: false,
      async options({ prevContext }) {
        const {
          runs, has_more, next,
        } = await this.listRuns({
          after: prevContext.after,
        });
        return {
          options: runs.map((run) => ({
            label: run.id,
            value: run.id,
          })),
          context: {
            after: has_more
              ? next
              : undefined,
          },
        };
      },
    },
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The ID of the thread to associate with the run.",
      optional: false,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Select the run statuses to monitor for events.",
      options: [
        {
          label: "Queued",
          value: "queued",
        },
        {
          label: "In Progress",
          value: "in_progress",
        },
        {
          label: "Requires Action",
          value: "requires_action",
        },
        {
          label: "Cancelling",
          value: "cancelling",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
        {
          label: "Failed",
          value: "failed",
        },
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Expired",
          value: "expired",
        },
      ],
      default: [
        "queued",
        "in_progress",
        "requires_action",
        "cancelling",
        "cancelled",
        "failed",
        "completed",
        "expired",
      ],
    },
  },
  methods: {
    _baseApiUrl() {
      return "https://api.openai.com/v1";
    },
    _commonHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest({
      $ = this, method = "GET", path, params, headers, ...otherOpts
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseApiUrl()}${path}`,
        headers: {
          ...this._commonHeaders(),
          ...headers,
        },
        params,
        ...otherOpts,
      });
    },
    async listRuns({ after } = {}) {
      return this._makeRequest({
        path: `/threads/${this.threadId}/runs`,
        params: {
          after,
        },
      });
    },
    async getRunStatus(runId) {
      return this._makeRequest({
        path: `/threads/${this.threadId}/runs/${runId}`,
      });
    },
  },
};
