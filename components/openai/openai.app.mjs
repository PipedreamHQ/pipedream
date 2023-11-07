import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The unique identifier for the thread.",
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The unique identifier for the run.",
    },
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "The unique identifier for the assistant.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The ID of the model to use.",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Instructions for the assistant.",
      optional: true,
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "A list of tools the model may call.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional information in a structured format.",
      optional: true,
    },
    toolOutputs: {
      type: "string[]",
      label: "Tool Outputs",
      description: "The outputs from the tool calls.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of items to retrieve.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order by the created_at timestamp of the objects.",
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "A cursor for use in pagination to fetch the next set of items.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "A cursor for use in pagination to fetch the previous set of items.",
      optional: true,
    },
    stepId: {
      type: "string",
      label: "Step ID",
      description: "The unique identifier for the run step.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openai.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async createRun({
      threadId, assistantId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs`,
        method: "POST",
        data: {
          assistant_id: assistantId,
          ...opts,
        },
      });
    },
    async retrieveRun({
      threadId, runId,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}`,
      });
    },
    async modifyRun({
      threadId, runId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}`,
        method: "PATCH", // Assuming modification is done via PATCH
        data: opts,
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
    async submitToolOutputs({
      threadId, runId, toolOutputs,
    }) {
      // Assuming toolOutputs should be parsed as JSON objects
      const parsedToolOutputs = toolOutputs.map(JSON.parse);
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/submit_tool_outputs`,
        method: "POST",
        data: {
          tool_outputs: parsedToolOutputs,
        },
      });
    },
    async cancelRun({
      threadId, runId,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/cancel`,
        method: "POST",
      });
    },
    async createThreadAndRun({
      assistantId, ...opts
    }) {
      return this._makeRequest({
        path: "/threads/runs",
        method: "POST",
        data: {
          assistant_id: assistantId,
          ...opts,
        },
      });
    },
    async retrieveRunStep({
      threadId, runId, stepId,
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps/${stepId}`,
      });
    },
    async listRunSteps({
      threadId, runId, ...opts
    }) {
      return this._makeRequest({
        path: `/threads/${threadId}/runs/${runId}/steps`,
        params: opts,
      });
    },
  },
};
