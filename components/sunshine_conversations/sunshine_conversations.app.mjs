import { axios } from "@pipedream/platform";
import jwt from "jsonwebtoken";

export default {
  type: "app",
  app: "sunshine_conversations",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user received from your Conversations Webhook to filter conversations.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation to get messages for.",
      async options({
        userId, prevContext,
      }) {
        const { conversations } = await this.getConversations({
          params: {
            page: {
              after: prevContext?.afterId,
            },
            filter: {
              userId,
            },
          },
        });

        return conversations.length
          ? {
            options: (conversations || []).map(({ id }) => id),
            context: {
              afterId: conversations[conversations.length - 1]?.id,
            },
          }
          : {
            options: [],
          };
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.zendesk.com/sc/v2/apps/${this.$auth.app_id}`;
    },
    _getHeaders() {
      const token = jwt.sign(
        {
          scope: "app",
        },
        this.$auth.secret,
        {
          header: {
            kid: this.$auth.key_id,
          },
          expiresIn: "1h",
        },
      );
      return {
        Authorization: `Bearer ${token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listMessages({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}/messages`,
        ...opts,
      });
    },
    getConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    getConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    postMessage({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/messages`,
        ...opts,
      });
    },
    updateConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    joinConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/join`,
        ...opts,
      });
    },
    listParticipants({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}/participants`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, resourceKey, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let afterId = null;

      do {
        params.page = {
          ...(params.page ?? {}),
          ...(afterId
            ? {
              after: afterId,
            }
            : {}),
        };

        const data = await fn({
          params,
          ...opts,
        });
        let resource = data[resourceKey] || [];
        for (const d of resource) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.meta?.hasMore;
        if (resource.length) {
          afterId = resource[resource.length - 1].id;
        }

      } while (hasMore);
    },
  },
};
