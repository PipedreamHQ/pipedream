import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chaindesk",
  version: "0.0.1",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of the agent",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query you want to ask your agent.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description to update the agent with to improve the accuracy of generated responses.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chaindesk.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendMessage({
      agentId, query,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agents/${agentId}/query`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          query,
        },
      });
    },
    async updateAgent({
      agentId, description,
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/agents/${agentId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          description,
        },
      });
    },
  },
};
