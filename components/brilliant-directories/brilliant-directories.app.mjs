import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "brilliant_directories",
  propDefinitions: {
    userData: {
      type: "object",
      label: "User Data",
      description: "The data for creating a new user record.",
    },
    postData: {
      type: "object",
      label: "Post Data",
      description: "The data for creating or updating a post.",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The unique identifier for the group post.",
      optional: true,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The unique identifier for the single post.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://mywebsite.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        data,
        params,
      });
    },
    async createUser({ userData }) {
      return this._makeRequest({
        method: "POST",
        path: "/user/create",
        data: userData,
      });
    },
    async createPost({
      postData, groupId,
    }) {
      // If groupId is provided, create a group post, else create a single post
      const path = groupId
        ? "/users_portfolio_groups/create"
        : "/data_posts/create";
      return this._makeRequest({
        method: "POST",
        path: path,
        data: postData,
      });
    },
    async updatePost({
      postId, postData,
    }) {
      if (!postId) {
        throw new Error("postId is required for updating a post.");
      }
      return this._makeRequest({
        method: "PUT",
        path: `/data_posts/update/${postId}`,
        data: postData,
      });
    },
  },
};
