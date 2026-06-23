import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "letmepost",
  propDefinitions: {
    accounts: {
      type: "string[]",
      label: "Accounts",
      description: "The connected accounts to publish to. **List Accounts** action can be used to discover account IDs.",
      async options() {
        const { data } = await this.listAccounts();
        return data.map((account) => ({
          label: `${account.displayName ?? account.platform} (${account.platform})`,
          value: account.id,
        }));
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post to retrieve. **List Posts** action can be used to discover post IDs.",
      async options({ prevContext }) {
        const params = {
          limit: 50,
        };
        if (prevContext?.cursor) {
          params.cursor = prevContext.cursor;
        }
        const {
          data, nextCursor,
        } = await this.listPosts({
          params,
        });
        return {
          options: data.map((post) => ({
            label: `${post.platform}: ${(post.text ?? "").slice(0, 40)} (${post.status})`,
            value: post.id,
          })),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letmepost.dev";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
      });
    },
    publishPost(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/posts",
        ...args,
      });
    },
    getPost({
      postId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/v1/posts/${encodeURIComponent(postId)}`,
        ...args,
      });
    },
    listPosts(args = {}) {
      return this._makeRequest({
        path: "/v1/posts",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "/v1/accounts",
        ...args,
      });
    },
    listMedia(args = {}) {
      return this._makeRequest({
        path: "/v1/media",
        ...args,
      });
    },
    createWebhookEndpoint(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/webhook-endpoints",
        ...args,
      });
    },
    deleteWebhookEndpoint({
      endpointId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/v1/webhook-endpoints/${endpointId}`,
        ...args,
      });
    },
  },
};
