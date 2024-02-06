import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_salesiq",
  propDefinitions: {
    screenName: {
      type: "string",
      label: "Screen Name",
      description: "Screen name associated with the account",
      async options() {
        const { data } = await this.listPortals();
        return data?.map(({
          name: label, screenname: value,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Identifier of a conversation",
      async options({
        screenName, page,
      }) {
        const params = {
          page: page + 1,
        };
        const { data } = await this.listConversations({
          screenName,
          params,
        });
        return data?.map(({
          question: label, id: value,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    articleCategoryId: {
      type: "string",
      label: "Category",
      description: "Specify the Category ID with which the article is associated.",
      async options({
        screenName, prevContext,
      }) {
        const { index = 0 } = prevContext;
        const params = {
          index,
          limit: 20,
        };
        const { data } = await this.listArticleCategories({
          screenName,
          params,
        });
        const options = data?.map(({
          name: label, id: value,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            index: index + params.limit,
          },
        };
      },
    },
    departmentId: {
      type: "string",
      label: "Department",
      description: "Specify the Department ID with which the article is associated.",
      async options({ screenName }) {
        const { data } = await this.listDepartments({
          screenName,
        });
        return data?.map(({
          name: label, id: value,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    appIds: {
      type: "string[]",
      label: "Apps",
      description: "The list of app IDs to which the webhook needs to be associated",
      async options({ screenName }) {
        const { data } = await this.listApps({
          screenName,
        });
        return data?.map(({
          name: label, id: value,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.base_api_uri}/api/v2`;
    },
    _headers() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/webhooks`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      screenName, webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/webhooks/${webhookId}`,
        method: "DELETE",
        ...args,
      });
    },
    getVisitorFeedback({
      screenName, conversationId, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/conversations/${conversationId}/feedback`,
        ...args,
      });
    },
    listApps({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/apps`,
        ...args,
      });
    },
    listPortals(args = {}) {
      return this._makeRequest({
        path: "/portals",
        ...args,
      });
    },
    listFeedback({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/feedbacks`,
        ...args,
      });
    },
    listConversations({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/conversations`,
        ...args,
      });
    },
    listArticleCategories({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/articlecategories`,
        ...args,
      });
    },
    listDepartments({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/departments`,
        ...args,
      });
    },
    createArticle({
      screenName, ...args
    }) {
      return this._makeRequest({
        path: `/${screenName}/articles`,
        method: "POST",
        ...args,
      });
    },
    async paginate({
      resourceFn, args, maxResults = 100,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          index: 1,
          limit: 20,
        },
      };
      let total = 0;
      const results = [];

      do {
        const { data } = await resourceFn(args);
        if (!data?.length) {
          break;
        }
        results.push(...data);
        total = data.length;
        args.params.index += args.params.limit;
      } while (total === args.params.limit && results.length < maxResults);

      if (results.length > maxResults) {
        results.length = maxResults;
      }

      return results;
    },
  },
};
