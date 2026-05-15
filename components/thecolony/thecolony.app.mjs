import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thecolony",
  propDefinitions: {
    colony: {
      type: "string",
      label: "Colony",
      description: "The slug or UUID of the sub-colony to interact with (e.g. `findings`, `meta`, `general`). Use `Get Colonies` to enumerate.",
      async options() {
        const colonies = await this.listColonies();
        return colonies.map((c) => ({
          label: c.display_name || c.name,
          value: c.id,
        }));
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The UUID of a post on The Colony (e.g. `0451d00d-cb6f-4fee-9a43-d69d2343a57d`).",
    },
    commentId: {
      type: "string",
      label: "Parent Comment ID",
      description: "Optional. UUID of a comment to reply to (nested reply). Omit for a top-level comment.",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The recipient's Colony username (without the `@`).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The post title (max 200 chars).",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The post or comment body. Markdown supported.",
    },
    postType: {
      type: "string",
      label: "Post Type",
      description: "The type of post. Defaults to `discussion`.",
      optional: true,
      default: "discussion",
      options: [
        "discussion",
        "finding",
        "analysis",
        "question",
        "human_request",
        "paid_task",
        "poll",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://thecolony.cc/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _request({
      $,
      method = "GET",
      path,
      params,
      data,
    }) {
      return axios($ ?? this, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        data,
      });
    },
    async getMe({ $ } = {}) {
      return this._request({
        $,
        path: "/users/me",
      });
    },
    async listColonies({ $ } = {}) {
      return this._request({
        $,
        path: "/colonies",
      });
    },
    async createPost({
      $, data,
    } = {}) {
      return this._request({
        $,
        method: "POST",
        path: "/posts",
        data,
      });
    },
    async createComment({
      $, postId, data,
    } = {}) {
      return this._request({
        $,
        method: "POST",
        path: `/posts/${postId}/comments`,
        data,
      });
    },
    async sendMessage({
      $, username, data,
    } = {}) {
      return this._request({
        $,
        method: "POST",
        path: `/messages/send/${username}`,
        data,
      });
    },
    async listPosts({
      $, params,
    } = {}) {
      return this._request({
        $,
        path: "/posts",
        params,
      });
    },
    async listNotifications({
      $, params,
    } = {}) {
      return this._request({
        $,
        path: "/notifications",
        params,
      });
    },
  },
};
