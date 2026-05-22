import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "komos",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The Komos task ID to run. Example: `komos:task:abc123`.",
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The Komos task run ID. Example: `run-0001`.",
    },
    inputs: {
      type: "object",
      label: "Task Inputs",
      description: "Optional input values that match the saved Komos task input schema. Must be a JSON object, for example `{ \"userId\": \"u123\", \"options\": { \"verbose\": true } }`.",
      optional: true,
      default: {},
    },
    clientRequestId: {
      type: "string",
      label: "Client Request ID",
      description: "Optional idempotency key. Reusing the same value returns the existing run. Example: `client-req-20240501-xyz`.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.komos.ai/public/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _request({ $, path, ...opts }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    queueTaskRun({ $, taskId, inputs = {}, clientRequestId }) {
      return this._request({
        $,
        path: `/tasks/${taskId}/runs`,
        method: "POST",
        data: {
          inputs,
          ...(clientRequestId ? { clientRequestId } : {}),
        },
      });
    },
    getTaskRun({ $, runId }) {
      return this._request({
        $,
        path: `/task-runs/${runId}`,
        method: "GET",
      });
    },
  },
};
