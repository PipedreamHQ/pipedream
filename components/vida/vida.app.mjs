import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vida",
  propDefinitions: {
    agent: {
      type: "string",
      label: "Agent",
      description: "The agent handling the communication",
      async options({ prevContext }) {
        const page = prevContext?.page || 1;
        const response = await this._makeRequest({
          method: "GET",
          path: "/agents",
          params: {
            page,
          },
        });
        const options = response.map((agent) => ({
          label: agent.name,
          value: agent.id,
        }));
        return {
          options,
          context: {
            page: page + 1,
          },
        };
      },
    },
    communicationSource: {
      type: "string",
      label: "Communication Source",
      description: "The source of the communication",
      options: [
        "call",
        "text",
        "email",
      ],
    },
    aiAgentId: {
      type: "string",
      label: "AI Agent Identity",
      description: "The identity of the AI agent the additional context is for",
    },
    additionalContext: {
      type: "string",
      label: "Additional Context",
      description: "The additional context information to upload",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.vida.dev/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async emitIncomingCommunicationEvent({
      agent, communicationSource,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/communication/incoming",
        data: {
          agent,
          source: communicationSource,
        },
      });
    },
    async emitCompletedCommunicationEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/communication/completed",
      });
    },
    async uploadConversationContext({
      aiAgentId, additionalContext,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/context",
        data: {
          target: aiAgentId,
          context: additionalContext,
        },
      });
    },
  },
};
