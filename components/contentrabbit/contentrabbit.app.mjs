import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contentrabbit",
  propDefinitions: {
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post.",
      async options({ page }) {
        const { data } = await this.listPosts({
          params: {
            limit: 25,
            page: page + 1,
          },
        });
        return (data ?? []).map((post) => ({
          label: post.title || post.content?.slice(0, 80) || post.id,
          value: post.id,
        }));
      },
    },
    platformType: {
      type: "string",
      label: "Platform",
      description: "Primary platform (e.g. `twitter`, `linkedin`, `instagram`).",
      async options() {
        const { data } = await this.listAccounts();
        const platforms = new Set((data ?? []).map((a) => a.platform));
        return Array.from(platforms).sort();
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Post status filter.",
      options: [
        "draft",
        "scheduled",
        "publishing",
        "published",
        "error",
        "idea",
        "pending_approval",
        "approved",
      ],
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Type of media to list.",
      options: [
        {
          label: "Images",
          value: "images",
        },
        {
          label: "Videos",
          value: "videos",
        },
      ],
      default: "images",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://contentrabbitai.com/api/public/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, method = "GET", params, data, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: this._headers(),
        params,
        data,
        ...opts,
      });
    },
    // ─── Posts ────────────────────────────────────────────────────
    async listPosts(opts = {}) {
      return this._makeRequest({
        path: "/posts",
        ...opts,
      });
    },
    async getPost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}`,
        ...opts,
      });
    },
    async createPost(opts = {}) {
      return this._makeRequest({
        path: "/posts",
        method: "POST",
        ...opts,
      });
    },
    async updatePost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}`,
        method: "PATCH",
        ...opts,
      });
    },
    async deletePost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}`,
        method: "DELETE",
        ...opts,
      });
    },
    async schedulePost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}/schedule`,
        method: "POST",
        ...opts,
      });
    },
    async unschedulePost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}/schedule`,
        method: "DELETE",
        ...opts,
      });
    },
    async publishPost({
      postId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/posts/${postId}/publish`,
        method: "POST",
        ...opts,
      });
    },
    // ─── Accounts ─────────────────────────────────────────────────
    async listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    // ─── Teams ────────────────────────────────────────────────────
    async listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    // ─── Analytics ────────────────────────────────────────────────
    async getPostAnalytics(opts = {}) {
      return this._makeRequest({
        path: "/analytics/posts",
        ...opts,
      });
    },
    async getPlatformAnalytics(opts = {}) {
      return this._makeRequest({
        path: "/analytics/platforms",
        ...opts,
      });
    },
    // ─── Activity ─────────────────────────────────────────────────
    async listActivity(opts = {}) {
      return this._makeRequest({
        path: "/activity",
        ...opts,
      });
    },
    // ─── Media ────────────────────────────────────────────────────
    async listMedia({
      type = "images", ...opts
    } = {}) {
      return this._makeRequest({
        path: `/media/${type}`,
        ...opts,
      });
    },
    async createUploadUrl(opts = {}) {
      return this._makeRequest({
        path: "/media/upload-url",
        method: "POST",
        ...opts,
      });
    },
    async registerImage(opts = {}) {
      return this._makeRequest({
        path: "/media/images",
        method: "POST",
        ...opts,
      });
    },
    // ─── Webhooks ─────────────────────────────────────────────────
    async listWebhookDeliveries(opts = {}) {
      return this._makeRequest({
        path: "/webhooks/deliveries",
        ...opts,
      });
    },
  },
};
