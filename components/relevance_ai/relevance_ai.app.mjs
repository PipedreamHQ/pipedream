import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "relevance_ai",
  propDefinitions: {
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The ID of the covnersation.",
      async options({
        page, agentId,
      }) {
        const { results } = await this.listConversations({
          data: {
            filters: [
              {
                filter_type: "exact_match",
                field: "type",
                condition_value: "conversation",
              },
              {
                filter_type: "exact_match",
                field: "conversation.agent_id",
                condition_value: agentId,
              },
            ],
            include_hidden: true,
            page: page + 1,
            page_size: LIMIT,
          },
        });

        return results.map(({
          knowledge_set: value, metadata,
        }) => ({
          label: metadata?.conversation?.title || value,
          value,
        }));
      },
    },
    toolId: {
      type: "string",
      label: "Tool ID",
      description: "The ID of the tool to execute.",
      async options({ page }) {
        const { results } = await this.listTools({
          params: {
            filters: JSON.stringify([
              {
                field: "project",
                condition: "==",
                condition_value: this.$auth.project,
                filter_type: "exact_match",
              },
            ]),
            page: page + 1,
            page_size: LIMIT,
          },
        });

        return results.map(({
          studio_id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api-${this.$auth.region}.stack.tryrelevance.com/latest`;
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.project}:${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/knowledge/sets/list",
        ...opts,
      });
    },
    listTools(opts = {}) {
      return this._makeRequest({
        path: "/studios/list",
        ...opts,
      });
    },
    getJobStatus({
      toolId, jobId,
    }) {
      return this._makeRequest({
        path: `/studios/${toolId}/async_poll/${jobId}`,
        params: {
          ending_update_only: true,
        },
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agents/trigger",
        ...opts,
      });
    },
    executeTool({
      toolId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/studios/${toolId}/trigger_async`,
        ...opts,
      });
    },
  },
};
