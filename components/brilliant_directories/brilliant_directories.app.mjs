import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "brilliant_directories",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "The unique identifier for a user.",
    },
    dataId: {
      type: "integer",
      label: "Data ID",
      description: "The data id for the post.",
    },
    dataType: {
      type: "integer",
      label: "Data Type",
      description: "The data type for the post.",
    },
    postTitle: {
      type: "string",
      label: "Post Title",
      description: "The title of the post.",
    },
    postContent: {
      type: "string",
      label: "Post Content",
      description: "The content of the post.",
    },
    postCategory: {
      type: "string",
      label: "Post Category",
      description: "The category of the post.",
    },
    postType: {
      type: "string",
      label: "Post Type",
      description: "The type of the post.",
    },
    postTags: {
      type: "string[]",
      label: "Post Tags",
      description: "A list of tags to the post.",
    },
    postStatus: {
      type: "boolean",
      label: "Post Status",
      description: "The status of the post.",
    },
    postStartDate: {
      type: "string",
      label: "Post Start Date",
      description: "The start date of the post. **Format yyyymmddhhmmss**",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.website_domain}/api/v2`;
    },
    _getHeaders() {
      return {
        "X-Api-Key": this.$auth.api_key,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user/create",
        ...args,
      });
    },
    async createPost(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/data_posts/create",
        ...args,
      });
    },
    async updatePost(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/data_posts/update",
        ...args,
      });
    },
  },
};
