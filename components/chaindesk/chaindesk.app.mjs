import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chaindesk",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of the agent",
      async options() {
        const data = await this.listAgents();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.chaindesk.ai/api";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path = "/",  ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listAgents(opts = {}) {
      return this._makeRequest({
        path: "/agents",
        ...opts,
      });
    },
    listMessages({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    sendMessage({
      agentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agents/${agentId}/query`,
        ...opts,
      });
    },
    updateAgent({
      agentId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/agents/${agentId}`,
        ...opts,
      });
    },
  },
};
