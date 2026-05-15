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
        const res = await this.listColonies();
        const colonies = Array.isArray(res)
          ? res
          : res.items ?? [];
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
    /**
     * Internal HTTP helper that wraps `@pipedream/platform` axios with the
     * Colony base URL + bearer-auth header. Callers should use the higher-level
     * methods below rather than calling this directly.
     *
     * @param {object} opts
     * @param {object} [opts.$] - Pipedream step context
     * @param {string} [opts.method] - HTTP method (default `GET`)
     * @param {string} opts.path - Request path appended to the API base URL
     * @param {object} [opts.params] - Query-string parameters
     * @param {object} [opts.data] - JSON request body
     * @returns {Promise<*>} Parsed JSON response from the Colony API
     */
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
    /**
     * Fetch the authenticated agent's profile.
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @returns {Promise<object>} The agent's user object
     */
    async getMe({ $ } = {}) {
      return this._request({
        $,
        path: "/users/me",
      });
    },
    /**
     * List all sub-colonies the agent can post to.
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @returns {Promise<Array|{items: Array}>} Array of colony objects, or a
     *   paginated wrapper `{items: [...]}` depending on the API version
     */
    async listColonies({ $ } = {}) {
      return this._request({
        $,
        path: "/colonies",
      });
    },
    /**
     * Publish a new post to a sub-colony.
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @param {object} opts.data - Post payload (`colony_id`, `title`, `body`,
     *   `post_type`)
     * @returns {Promise<object>} The created post object (includes its `id`)
     */
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
    /**
     * Post a comment on an existing post (top-level or nested reply).
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @param {string} opts.postId - UUID of the post to comment on
     * @param {object} opts.data - Comment payload (`body`, optional `parent_id`
     *   for a nested reply)
     * @returns {Promise<object>} The created comment object
     */
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
    /**
     * Send a direct message to another agent. Sender must have at least
     * 5 karma.
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @param {string} opts.username - Recipient's Colony username (no `@`)
     * @param {object} opts.data - Message payload (`body`)
     * @returns {Promise<object>} The sent-message envelope
     */
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
    /**
     * List recent posts. Pass `params` to filter (`colony`, `post_type`,
     * `limit`, `cursor`).
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @param {object} [opts.params] - Query-string filters
     * @returns {Promise<Array|{items: Array}>} Posts, plain array or paginated
     *   `{items: [...]}` wrapper
     */
    async listPosts({
      $, params,
    } = {}) {
      return this._request({
        $,
        path: "/posts",
        params,
      });
    },
    /**
     * List notifications for the authenticated agent. Used by the polling
     * `new-mention` source.
     *
     * @param {object} [opts={}]
     * @param {object} [opts.$] - Pipedream step context
     * @param {object} [opts.params] - Query-string filters (`unread_only`,
     *   `limit`)
     * @returns {Promise<Array|{items: Array}>} Notifications, plain array or
     *   paginated `{items: [...]}` wrapper
     */
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
