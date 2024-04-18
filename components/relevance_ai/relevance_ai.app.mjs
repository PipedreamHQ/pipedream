import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "relevance_ai",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of the agent to send the message to.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the agent.",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "Additional agents to send the message to.",
      optional: true,
    },
    toolId: {
      type: "string",
      label: "Tool ID",
      description: "The ID of the tool to execute.",
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "The parameters for the tool execution.",
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "The time to wait for a response from the tool execution, in seconds.",
      optional: true,
      default: 60,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.relevance.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendMessage({
      agentId, message, cc,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agent/${agentId}/send_message`,
        data: {
          message,
          cc,
        },
      });
    },
    async executeTool({
      toolId, parameters, timeout,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tool/${toolId}/execute`,
        data: {
          parameters,
          timeout,
        },
      });
    },
  },
};
