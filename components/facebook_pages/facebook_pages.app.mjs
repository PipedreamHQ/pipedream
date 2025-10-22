import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_pages",
  propDefinitions: {
    page: {
      type: "string",
      label: "Page",
      description: "The identifier of a page",
      async options({ prevContext }) {
        const params = {};
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const {
          data, paging,
        } = await this.listPages({
          params,
        });
        const options = data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options,
          context: {
            after: paging?.cursors?.after,
          },
        };
      },
    },
    post: {
      type: "string",
      label: "Post",
      description: "The identifier of a post",
      async options({
        pageId, prevContext,
      }) {
        const params = {};
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const {
          data, paging,
        } = await this.listPosts({
          pageId,
          params,
        });
        const options = data?.map(({
          id, message,
        }) => ({
          label: message,
          value: id,
        })) || [];
        return {
          options,
          context: {
            after: paging?.cursors?.after,
          },
        };
      },
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The identifier of a comment",
      async options({
        pageId, postId, prevContext,
      }) {
        const params = {};
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const {
          data, paging,
        } = await this.listComments({
          pageId,
          postId,
          params,
        });
        const options = data?.map(({
          id, message,
        }) => ({
          label: message,
          value: id,
        })) || [];
        return {
          options,
          context: {
            after: paging?.cursors?.after,
          },
        };
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
    appId: {
      type: "string",
      label: "App ID",
      description: "The Facebook App ID. You can find this in your Facebook App Dashboard.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.facebook.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _userId() {
      return this.$auth.oauth_uid;
    },
    async _makeRequest({
      $ = this,
      path,
      pageId,
      params,
      ...args
    }) {
      if (pageId) {
        params = {
          ...params,
          access_token: await this.getAccessToken(pageId),
        };
      }
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        ...args,
      });
    },
    async getAccessToken(pageId) {
      const { data } = await this.listPages();
      const page = data.find(({ id }) => id == pageId);
      return page.access_token;
    },
    getAppAccessToken(args = {}) {
      return this._makeRequest({
        path: "/oauth/access_token",
        ...args,
      });
    },
    getPost({
      pageId, postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}`,
        pageId,
        ...args,
      });
    },
    getComment({
      pageId, commentId, ...args
    }) {
      return this._makeRequest({
        path: `/${commentId}`,
        pageId,
        ...args,
      });
    },
    listPages(args = {}) {
      return this._makeRequest({
        path: `/${this._userId()}/accounts`,
        ...args,
      });
    },
    listPosts({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/${pageId}/feed`,
        pageId,
        ...args,
      });
    },
    listComments({
      pageId, postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/comments`,
        pageId,
        ...args,
      });
    },
    createPost({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/${pageId}/feed`,
        method: "POST",
        pageId,
        ...args,
      });
    },
    createComment({
      pageId, postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}/comments`,
        method: "POST",
        pageId,
        ...args,
      });
    },
    updatePost({
      pageId, postId, ...args
    }) {
      return this._makeRequest({
        path: `/${postId}`,
        method: "POST",
        pageId,
        ...args,
      });
    },
    updateComment({
      pageId, commentId, ...args
    }) {
      return this._makeRequest({
        path: `/${commentId}`,
        method: "POST",
        pageId,
        ...args,
      });
    },
    createSubscription({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${appId}/subscriptions`,
        method: "POST",
        ...args,
      });
    },
    deleteSubscription({
      appId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${appId}/subscriptions`,
        method: "DELETE",
        ...args,
      });
    },
    createPageSubscription({
      pageId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${pageId}/subscribed_apps`,
        method: "POST",
        pageId,
        ...args,
      });
    },
    deletePageSubscription({
      pageId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${pageId}/subscribed_apps`,
        method: "DELETE",
        pageId,
        ...args,
      });
    },
  },
};
