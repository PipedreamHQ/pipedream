import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cursor",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for the request. If not provided, we'll pick the most appropriate model.",
      async options() {
        const { models } = await this.listModels();
        return models;
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of an agent",
      async options({
        prevContext, status,
      }) {
        const {
          agents, nextCursor,
        } = await this.listAgents({
          params: {
            cursor: prevContext?.cursor,
          },
        });
        let filteredAgents = agents || [];
        if (status) {
          filteredAgents = filteredAgents?.filter(({ status }) => status === status);
        }
        const options = filteredAgents?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
        return {
          options,
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    sourceRepository: {
      type: "string",
      label: "Source Repository",
      description: "GitHub repository URL (e.g., https://github.com/your-org/your-repo)",
      async options() {
        const { repositories } = await this.listRepositories();
        return repositories?.map(({
          repository: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "Images to use for the request (max 5). This can be a file URL or path to a file in the `/tmp` directory (for example, `/tmp/example.jpg`)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cursor.com/v0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "",
        },
      });
    },
    listModels(opts = {}) {
      return this._makeRequest({
        path: "/models",
        ...opts,
      });
    },
    listAgents(opts = {}) {
      return this._makeRequest({
        path: "/agents",
        ...opts,
      });
    },
    listRepositories(opts = {}) {
      return this._makeRequest({
        path: "/repositories",
        ...opts,
      });
    },
    getAgentStatus({
      agentId, ...opts
    }) {
      return this._makeRequest({
        path: `/agents/${agentId}`,
        ...opts,
      });
    },
    getAgentConversation({
      agentId, ...opts
    }) {
      return this._makeRequest({
        path: `/agents/${agentId}/conversation`,
        ...opts,
      });
    },
    launchAgent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agents",
        ...opts,
      });
    },
    addFollowup({
      agentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agents/${agentId}/followup`,
        ...opts,
      });
    },
    stopAgent({
      agentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/agents/${agentId}/stop`,
        ...opts,
      });
    },
  },
};
