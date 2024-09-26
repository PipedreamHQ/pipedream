import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blogger",
  propDefinitions: {
    blog: {
      type: "string",
      label: "Blog",
      description: "Blog where the action will be performed.",
      async options() {
        const data = await this.getUserBlogs();
        return data.items.map((blog) => ({
          label: blog.name,
          value: blog.id,
        }));
      },
    },
    post: {
      type: "string",
      label: "Post",
      description: "Post where the action will be performed.",
      async options({
        blog,
        status,
        prevContext,
      }) {
        const data = await this.getBlogPosts(
          this,
          blog,
          status,
          prevContext.nextPageToken,
        );

        return {
          options: data.items.map((item) => ({
            label: item.title,
            value: item.id,
          })),
          context: {
            nextPageToken: data.nextPageToken,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Your post title.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Your post content.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.googleapis.com/blogger/v3";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async getUserBlogs(ctx = this) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        path: `/users/${this.$auth.oauth_uid}/blogs`,
      }));
    },
    async getBlogPost(ctx = this, blogId, postId) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        path: `/blogs/${blogId}/posts/${postId}`,
      }));
    },
    async getBlogPosts(ctx = this, blogId, status, pageToken) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        path: `/blogs/${blogId}/posts`,
        params: {
          fetchBodies: false,
          fetchImages: false,
          pageToken,
          status,
        },
      }));
    },
    async newPost(ctx = this, blogId, data, params) {
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: `/blogs/${blogId}/posts`,
        data,
        params,
      }));
    },
    async updatePost(ctx = this, blogId, postId, data) {
      return axios(ctx, this._getRequestParams({
        method: "PUT",
        path: `/blogs/${blogId}/posts/${postId}`,
        data,
      }));
    },
    async publishPost(ctx = this, blogId, postId, publishDate) {
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: `/blogs/${blogId}/posts/${postId}/publish`,
        params: {
          publishDate,
        },
      }));
    },
    async deletePost(ctx = this, blogId, postId) {
      return axios(ctx, this._getRequestParams({
        method: "DELETE",
        path: `/blogs/${blogId}/posts/${postId}`,
      }));
    },
    async revertPost(ctx = this, blogId, postId) {
      return axios(ctx, this._getRequestParams({
        method: "POST",
        path: `/blogs/${blogId}/posts/${postId}/revert`,
      }));
    },
  },
};
