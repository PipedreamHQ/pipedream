import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "help_scout",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "ID of the agent to whom the conversation is assigned",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The unique identifier of the conversation.",
      async options({ page }) {
        const { _embedded: { conversations } } = await this.listConversations({
          params: {
            page: page + 1,
          },
        });

        return conversations.map(({
          id: value, subject, primaryCustomer: { email },
        }) => ({
          label: `${subject}(${value}) - ${email}`,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier of the customer",
      async options({ page }) {
        const { _embedded: { customers } } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map(({
          id: value, firstName, lastName, _embedded: { emails },
        }) => ({
          label: `${firstName} ${lastName} - ${emails[0].id}`,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user",
      async options({ page }) {
        const { _embedded: { users } } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return users.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The unique identifier of the tag",
      async options({ page }) {
        const { _embedded: { tags } } = await this.listTags({
          params: {
            page: page + 1,
          },
        });
        return tags.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    text: {
      type: "string",
      label: "Text",
      description: "The content of the note",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpscout.net/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getTag({
      tagId, ...opts
    }) {
      return this._makeRequest({
        path: `/tags/${tagId}`,
        ...opts,
      });
    },
    listConversations(opts = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    addNoteToConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/notes`,
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    sendReplyToConversation({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/reply`,
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
    getConversationThreads({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}/threads`,
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
  },
};
