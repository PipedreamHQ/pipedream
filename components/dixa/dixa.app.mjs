import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dixa",
  propDefinitions: {
    endUserId: {
      type: "string",
      label: "End User Id",
      description: "The id of the end user.",
      async options({ page }) {
        const { data } = await this.listEndUsers({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction of the message",
      options: [
        "Inbound",
        "Outbound",
      ],
    },
    emailIntegrationId: {
      type: "string",
      label: "Email Integration ID",
      description: "The contact endpoint in the organization.",
      async options() {
        const { data } = await this.listContactEndpoints();
        return data.filter(({ _type }) => _type === "EmailEndpoint").map(({ address }) => address);
      },
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the conversation",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The [2-letter ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language of the conversation",
    },
    agentId: {
      type: "string",
      label: "Agent Id",
      description: "The id of the agent.",
      hidden: true,
      async options({ page }) {
        const { data } = await this.listAgents({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The ID of the conversation",
      async options({ endUserId }) {
        const { data } = await this.listConversations({
          endUserId,
        });
        return data.map(({
          id: value, direction, toEmail, fromEmail,
        }) => {
          return {
            label: `${direction} - ${direction === "Inbound"
              ? fromEmail
              : toEmail}`,
            value,
          };
        });
      },
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag to add",
      async options() {
        const { data } = await this.listTags();
        return data
          .filter(({ state }) => state === "Active")
          .map(({
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
      return "https://dev.dixa.io/v1";
    },
    _headers() {
      return {
        "authorization": `${this.$auth.api_key}`,
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
    listEndUsers(opts = {}) {
      return this._makeRequest({
        path: "/endusers",
        ...opts,
      });
    },
    listAgents(opts = {}) {
      return this._makeRequest({
        path: "/agents",
        ...opts,
      });
    },
    listContactEndpoints(opts = {}) {
      return this._makeRequest({
        path: "/contact-endpoints",
        ...opts,
      });
    },
    listConversations({
      endUserId, ...opts
    }) {
      return this._makeRequest({
        path: `/endusers/${endUserId}/conversations`,
        ...opts,
      });
    },
    listCustomAttributes() {
      return this._makeRequest({
        path: "/custom-attributes",
      });
    },
    addTag({
      conversationId, tagId,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conversations/${conversationId}/tags/${tagId}`,
      });
    },
    updateCustomAttributes({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/endusers/${userId}/custom-attributes`,
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
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    createConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/conversations",
        ...opts,
      });
    },
    addMessage({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/messages`,
        ...opts,
      });
    },
    getArticle({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/knowledge/articles/${articleId}`,
        ...opts,
      });
    },
    getArticleTranslations({
      articleId, ...opts
    }) {
      return this._makeRequest({
        path: `/knowledge/articles/${articleId}/translations`,
        ...opts,
      });
    },
  },
};
