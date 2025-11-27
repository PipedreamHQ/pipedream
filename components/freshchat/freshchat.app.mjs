import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "freshchat",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of a user",
      async options({ page }) {
        const { users } = await this.listUsers({
          params: {
            page: page + 1,
            created_to: new Date().toISOString(),
          },
        });
        return users?.map(({
          id: value, email, phone,
        }) => ({
          label: email || phone,
          value,
        })) || [];
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of a conversation",
      async options({
        page, userId,
      }) {
        const { conversations } = await this.listConversations({
          userId,
          params: {
            page: page + 1,
          },
        });
        return conversations?.map(({ id }) => id) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of a group",
      async options({ page }) {
        const { groups } = await this.listGroups({
          params: {
            page: page + 1,
          },
        });
        return groups?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "The ID of an agent",
      async options({ page }) {
        const { agents } = await this.listAgents({
          params: {
            page: page + 1,
          },
        });
        return agents?.map(({
          id: value, email, phone,
        }) => ({
          label: email || phone,
          value,
        })) || [];
      },
    },
    actorId: {
      type: "string",
      label: "Actor ID",
      description: "If a user sends the message, the value of this attribute is a valid `user.id`. If an agent sends the message, the value of this attribute is a valid `agent.id`. User must be a member of the conversation.",
      async options({
        type, page,
      }) {
        page = page + 1;
        let actors = [];
        if (type === "user") {
          const { users } = await this.listUsers({
            params: {
              page,
              created_to: new Date().toISOString(),
            },
          });
          actors = users;
        }
        if (type === "agent") {
          const { agents } = await this.listAgents({
            params: {
              page,
            },
          });
          actors = agents;
        }
        return actors.map(({
          id: value, email, phone,
        }) => ({
          label: email || phone,
          value,
        }));
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
      return `https://${this.$auth.chat_url}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
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
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listConversations({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}/conversations`,
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
    listAgents(opts = {}) {
      return this._makeRequest({
        path: "/agents",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listChannels(opts = {}) {
      return this._makeRequest({
        path: "/channels",
        ...opts,
      });
    },
    listConversationProperties(opts = {}) {
      return this._makeRequest({
        path: "/conversations/fields",
        ...opts,
      });
    },
    sendMessageInChat({
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
        method: "PUT",
        path: `/conversations/${conversationId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      let hasMore, count = 0;
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          items_per_page: DEFAULT_LIMIT,
        },
      };
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        if (items.length === 0) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = !response.pagination
          ? false
          : response.pagination.total_pages > args.params.page;
        args.params.page++;
      } while (hasMore);
    },
    async getPaginatedResults(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
